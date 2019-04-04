const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_schema_migrations: [schema_migrations!]
        get_schema_migrations(id: ID!): schema_migrations
      }

      extend type Mutation {
        update_schema_migrations(
          version: String,
        ): schema_migrations

        delete_schema_migrations(id: ID!): Boolean!
      }

      type schema_migrations {
        version: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_schema_migrations: async () => {
          const r = await new Liana.ResourcesGetter(models.schema_migrations, {}, {}).perform();
          return r[0];
        },
        get_schema_migrations: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.schema_migrations, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_schema_migrations: async (obj, args) => {
          return await new Liana.ResourceRemover(models.schema_migrations, { recordId: args.id }).perform();
        },
        update_schema_migrations: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.schema_migrations, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

