const { ApolloServer } = require('apollo-server');
const  createSchema  = require('./schema');

createSchema().then((schema) => {
  const server = new ApolloServer({ schema });

  // normal ApolloServer listen call but url will contain /graphql
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });
})
.catch(console.log);
