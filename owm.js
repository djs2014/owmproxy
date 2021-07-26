let getPropValue = function (item, name, def) {
    if (!item || !item.hasOwnProperty(name)) { return def; }
    return item[name];
}

let getOWMweather = function (item, def) {
    if (!item || !item.weather || item.weather.length == 0) { return def; }
    return getPropValue(item.weather[0], "main", def).toLowerCase();
}

let getOWMweatherMinutely = function (minutely, def) {
    if (!minutely || minutely.length == 0) { return def; }

    let dt_start = 0;
    let pops = [];
    for (let idx in minutely) {
        let item = minutely[idx];
        //console.log(item);
        if (dt_start == 0) { dt_start = getPropValue(item, "dt", 0); }
        pops.push(getPropValue(item, "precipitation", 0));
    }
    return {
        dt_start: dt_start,
        pops: pops
    }
}

// @@ max 12 + start from current hour ..
let getOWMweatherHourly = function (hourly, def) {
    if (!hourly || hourly.length == 0) { return def; }

    let idx = 0;
    let hours = [];
    for (let idx in hourly) {
        let item = hourly[idx];
        //console.log(item);
        let h = {};
        h.dt = getPropValue(item, "dt", 0);
        h.clouds = getPropValue(item, "clouds", 0);
        h.pop = getPropValue(item, "pop", 0);
        h.weather = getOWMweather(item, "");
        h.uvi = getPropValue(item, "uvi", 0);
        hours.push(h);

        idx++;
        if (idx > 14) { break; }
    }
    return hours;
}

let getOWMWeatherCurrent = function (parsed) {
    return {
        "lat": getPropValue(parsed, "lat", 0),
        "lon": getPropValue(parsed, "lon", 0),
        "dt": getPropValue(parsed.current, "dt", 0),
        "tz_offset": getPropValue(parsed, "timezone_offset", 0),
        "clouds": getPropValue(parsed.current, "clouds", 0),
        "uvi": getPropValue(parsed.current, "uvi", 0),
        "weather": getOWMweather(parsed.current, ""),
    }
}

exports.convertOWMdata = function (data) {
    let mod = {};
    try {
        let jsonParsed = JSON.parse(data);

        mod.current = getOWMWeatherCurrent(jsonParsed);
        // minutely
        mod.minutely = getOWMweatherMinutely(jsonParsed.minutely, {});
        // hourly
        mod.hourly = getOWMweatherHourly(jsonParsed.hourly, []);
    } catch (ex) {
        console.log(ex);
    }
    return mod;
}