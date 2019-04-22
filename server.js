require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const depthLimit = require('graphql-depth-limit');

const createSchema = require('./schema');

createSchema()
  .then(schema => {
    const server = new ApolloServer({
      schema,
      engine: {
        apiKey: process.env.ENGINE_API_KEY,
      },
      validationRules: [depthLimit(6)],
    });

    // normal ApolloServer listen call but url will contain /graphql
    server.listen().then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
  .catch(console.log);
