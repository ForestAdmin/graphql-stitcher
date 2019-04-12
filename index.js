const fs = require('fs');
const gql = require('graphql-tag');
const GraphQLTools = require('graphql-tools');
const HttpLink = require('apollo-link-http').HttpLink;
const fetch = require('node-fetch');

module.exports = function (args) {
  const schemas = [];

  this.linkSchema = `
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

  this.addScalar = function (scalar) {
    this.linkSchema = this.linkSchema.replace(/^/, `    scalar ${scalar}\n`);
  };

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

  this.createLocalSchema = function (dir) {
    const typeDefs = [gql(this.linkSchema)];
    const resolvers = [];

    fs.readdirSync(dir).forEach((file) => {
      if (file !== 'index.js') {
        const GraphQLSchema = new (require(`${dir}/${file}`))(args);

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
