const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_ar_internal_metadata: [ar_internal_metadata!]
        get_ar_internal_metadata(id: ID!): ar_internal_metadata
      }

      extend type Mutation {
        update_ar_internal_metadata(
          key: String,
          value: String,
          created_at: String,
          updated_at: String,
        ): ar_internal_metadata

        delete_ar_internal_metadata(id: ID!): Boolean!
      }

      type ar_internal_metadata {
        key: String
        value: String
        created_at: String
        updated_at: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_ar_internal_metadata: async () => {
          const r = await new Liana.ResourcesGetter(models.ar_internal_metadata, {}, {}).perform();
          return r[0];
        },
        get_ar_internal_metadata: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.ar_internal_metadata, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_ar_internal_metadata: async (obj, args) => {
          return await new Liana.ResourceRemover(models.ar_internal_metadata, { recordId: args.id }).perform();
        },
        update_ar_internal_metadata: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.ar_internal_metadata, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

