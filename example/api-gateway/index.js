const express = require('express');
const ApolloServer = require('apollo-server-express').ApolloServer;
const GraphQLStitcher = require('graphql-stitcher');

const app = express();
const port = 3000;

const MEALS_ENDPOINT = 'http://localhost:3004/graphql';
const MOVIES_ENDPOINT = 'http://localhost:3005/graphql';

(async () => {
  const stitcher = new GraphQLStitcher();

  // Meals endpoint
  await stitcher.createRemoteSchema(MEALS_ENDPOINT);

  // Movies endpoint
  await stitcher.createRemoteSchema(MOVIES_ENDPOINT);

  // Stitch!
  const schema = stitcher.stitch();

  const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema
  });

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => console.log(`API Gateway listening on port ${port}!`));
})().catch((err) => {
  console.error(err);
});
