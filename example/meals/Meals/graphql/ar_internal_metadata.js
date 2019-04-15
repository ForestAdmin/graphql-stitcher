const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_ar_internal_metadata(search: String, filter: JSON): Int
        list_ar_internal_metadata(page: JSON, sort: String, search: String, filter: JSON): [ar_internal_metadata!]
        get_ar_internal_metadata(id: ID!): ar_internal_metadata
      }

      extend type Mutation {
        create_ar_internal_metadata(
          key: String,
          value: String,
          created_at: DateTime,
          updated_at: DateTime,
        ): ar_internal_metadata

        update_ar_internal_metadata(
          key: String,
          value: String,
          created_at: DateTime,
          updated_at: DateTime,
        ): ar_internal_metadata

        delete_ar_internal_metadata(id: ID!): Boolean
      }

      type ar_internal_metadata {
        key: String
        value: String
        created_at: DateTime
        updated_at: DateTime
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_ar_internal_metadata: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.ar_internal_metadata, opts, params).count();
        },
        list_ar_internal_metadata: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.ar_internal_metadata, opts, params).perform();
          return r[0];
        },
        get_ar_internal_metadata: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.ar_internal_metadata, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_ar_internal_metadata: async (obj, params) => {
          return await new Liana.ResourceCreator(models.ar_internal_metadata, params).perform();
        },
        update_ar_internal_metadata: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.ar_internal_metadata, { recordId: params.id }, params).perform();
        },
        delete_ar_internal_metadata: async (obj, params) => {
          return await new Liana.ResourceRemover(models.ar_internal_metadata, { recordId: params.id }).perform();
        },
      }
    }
  };
}
