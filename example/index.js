const SchemaManager = require('../');
const schemaManager = new SchemaManager();

(async () => {
  const countrySchema = await schemaManager.createRemoteSchema('https://countries.trevorblades.com');
  const githubSchema = await schemaManager.createRemoteSchema('https://api.github.com/graphql', {
    headers: {
      authorization: `Bearer ${process.env.STRIPE_TOKEN}`,
    },
  });
  const dbSchema = schemaManager.createLocalSchema(__dirname + '/graphql');

  return schemaManager.stitch();
})();

