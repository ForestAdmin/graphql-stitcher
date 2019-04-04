const express = require('express');
const ApolloServer = require('apollo-server-express').ApolloServer;
const GraphQLStitcher = require('graphql-stitcher');

const app = express();
const port = 3000;

(async () => {
  const stitcher = new GraphQLStitcher();

  // Meals endpoint
  const mealsSchema = await stitcher.createRemoteSchema('http://localhost:3004/graphql');

  // Movies endpoint
  const moviesSchema = await stitcher.createRemoteSchema('http://localhost:3005/graphql');

  // "countries" public API
  const countrySchema = await stitcher.createRemoteSchema('https://countries.trevorblades.com');

  // Github API
  //const githubSchema = await stitcher.createRemoteSchema('https://api.github.com/graphql', {
    //headers: { authorization: `Bearer ${process.env.STRIPE_TOKEN}`, },
  //});

  // Stitch!
  const schema = schemaManager.stitch();

  const server = new ApolloServer({ introspection: true, playground: true, schema });
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => console.log(`API Gateway listening on port ${port}!`));
})().catch((err) => {
  console.error(err);
});
