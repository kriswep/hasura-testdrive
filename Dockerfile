# v1.1
# see: https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
FROM node:10-alpine

# Create dirs
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy package.json and lockfile
COPY package*.json ./

USER node

# install deps
RUN npm install --production

# Copy all other files
COPY --chown=node:node . .

EXPOSE 4000

CMD [ "node", "./server.js" ]
