const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_chef_availabilities(search: String, filter: JSON): Int
        list_chef_availabilities(page: JSON, sort: String, search: String, filter: JSON): [chef_availabilities!]
        get_chef_availabilities(id: ID!): chef_availabilities
      }

      extend type Mutation {
        create_chef_availabilities(
          chef_id: Int,
          available_at: DateTime,
        ): chef_availabilities

        update_chef_availabilities(
          chef_id: Int,
          available_at: DateTime,
        ): chef_availabilities

        delete_chef_availabilities(id: ID!): Boolean
      }

      type chef_availabilities {
        id: ID!
        chef_id: Int
        available_at: DateTime
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_chef_availabilities: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.chef_availabilities, opts, params).count();
        },
        list_chef_availabilities: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.chef_availabilities, opts, params).perform();
          return r[0];
        },
        get_chef_availabilities: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.chef_availabilities, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_chef_availabilities: async (obj, params) => {
          return await new Liana.ResourceCreator(models.chef_availabilities, params).perform();
        },
        update_chef_availabilities: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.chef_availabilities, { recordId: params.id }, params).perform();
        },
        delete_chef_availabilities: async (obj, params) => {
          return await new Liana.ResourceRemover(models.chef_availabilities, { recordId: params.id }).perform();
        },
      }
    }
  };
}
