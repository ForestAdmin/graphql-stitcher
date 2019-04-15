const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_schema_migrations(search: String, filter: JSON): Int
        list_schema_migrations(page: JSON, sort: String, search: String, filter: JSON): [schema_migrations!]
        get_schema_migrations(id: ID!): schema_migrations
      }

      extend type Mutation {
        create_schema_migrations(
          version: String,
        ): schema_migrations

        update_schema_migrations(
          version: String,
        ): schema_migrations

        delete_schema_migrations(id: ID!): Boolean
      }

      type schema_migrations {
        version: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_schema_migrations: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.schema_migrations, opts, params).count();
        },
        list_schema_migrations: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.schema_migrations, opts, params).perform();
          return r[0];
        },
        get_schema_migrations: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.schema_migrations, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_schema_migrations: async (obj, params) => {
          return await new Liana.ResourceCreator(models.schema_migrations, params).perform();
        },
        update_schema_migrations: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.schema_migrations, { recordId: params.id }, params).perform();
        },
        delete_schema_migrations: async (obj, params) => {
          return await new Liana.ResourceRemover(models.schema_migrations, { recordId: params.id }).perform();
        },
      }
    }
  };
}
