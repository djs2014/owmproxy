const fetch = require("node-fetch");
const owm = require('./owm.js');

const API_SERVICE_URL = "https://api.openweathermap.org/data/2.5/onecall";

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
    // set this to true for detailed logging:
    logger: false
});

fastify.get("/", async function (request, reply) {
    //console.log('HTTP trigger function processed a request: ' + request.url);
    //fastify.log.info('HTTP trigger function processed a request: ' + request.url);
    try {
        let queryString = request.url.split('?').splice(1).join('?');
        let uri = API_SERVICE_URL + '?' + queryString;

        let fetchResp = await fetch(uri);
        let resBody = await fetchResp.text();

        reply.type('application/json');
        reply.statusCode = 200;
        reply.send(JSON.stringify(owm.convertOWMdata(resBody)));
    } catch (err) {
        reply.statusCode = 500;
        reply.send(err.message);
    }
});


// Run the server and report out to the logs
fastify.listen(process.env.PORT, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
});