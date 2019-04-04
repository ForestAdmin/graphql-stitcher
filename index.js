const fs = require('fs');
const gql = require('apollo-server-express').gql;
const HttpLink = require('apollo-link-http').HttpLink;
const fetch = require('node-fetch');
const GraphQLTools = require('graphql-tools');

module.exports = function () {
  const schemas = [];

  this.createRemoteSchema = async function (uri, moreOpts) {
    let opts = { uri, fetch };

    const link = new HttpLink({ ...opts, ...moreOpts, });
    const schema = GraphQLTools.makeRemoteExecutableSchema({
      schema: await GraphQLTools.introspectSchema(link),
      link
    });

    schemas.push(schema);
    return schema;
  };

  this.createLocalSchema = function (dir, linkSchema) {

    if (!linkSchema) {
      linkSchema = gql`
        type Query {
          _: Boolean
        }

        type Mutation {
          _: Boolean
        }

        type Subscription {
          _: Boolean
        }
      `;
    }

    const typeDefs = [linkSchema];
    const resolvers = [];

    fs.readdirSync(dir).forEach((file) => {
      if (file !== 'index.js') {
        const GraphQLSchema = new (require(`${dir}/${file}`))();

        typeDefs.push(GraphQLSchema.getSchema());
        resolvers.push(GraphQLSchema.getResolver());
      }
    });

    const schema = GraphQLTools.makeExecutableSchema({ typeDefs, resolvers, });
    schemas.push(schema);

    return schema;
  };

  this.stitch = function () {
    return GraphQLTools.mergeSchemas({ schemas });
  };
};
