FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /app

COPY package*.json ./

COPY --chown=node:node . .

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

USER node
#CMD [ "node", "server.js" ]
CMD ["dumb-init", "node", "server.js"]