const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const { WebSocketLink } = require('apollo-link-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const { split } = require('apollo-link');
const { getMainDefinition } = require('apollo-utilities');

const fetch = require('node-fetch');
const ws = require('ws');

const scheme = proto => {
  return process.env.HASURA_GRAPHQL_ENGINE_PROTO === 'https' ? `${proto}s` : proto;
};
const HASURA_GRAPHQL_ENGINE_HOSTNAME = process.env.HASURA_GRAPHQL_ENGINE_HOSTNAME || 'localhost:8080';
const GRAPHQL_ENDPOINT = `${scheme('http')}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1alpha1/graphql`;
const WEBSOCKET_ENDPOINT = `${scheme('ws')}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1alpha1/graphql`;

// Make WebSocketLink with appropriate url
const mkWsLink = uri => {
  const subClient = new SubscriptionClient(WEBSOCKET_ENDPOINT, { reconnect: true }, ws);
  return new WebSocketLink(subClient);
};

// Make HttpLink
const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT, fetch });
const wsLink = mkWsLink(GRAPHQL_ENDPOINT);
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const createSchema = async () => {
  const schema = makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link,
  });
  return schema;
};

module.exports = createSchema;
