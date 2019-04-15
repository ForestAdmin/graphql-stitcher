const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_menus(search: String, filter: JSON): Int
        list_menus(page: JSON, sort: String, search: String, filter: JSON): [menus!]
        get_menus(id: ID!): menus
      }

      extend type Mutation {
        create_menus(
          available_at: DateTime,
          chef_id: Int,
        ): menus

        update_menus(
          available_at: DateTime,
          chef_id: Int,
        ): menus

        delete_menus(id: ID!): Boolean
      }

      type menus {
        id: ID!
        available_at: DateTime
        chef_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_menus: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.menus, opts, params).count();
        },
        list_menus: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.menus, opts, params).perform();
          return r[0];
        },
        get_menus: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.menus, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_menus: async (obj, params) => {
          return await new Liana.ResourceCreator(models.menus, params).perform();
        },
        update_menus: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.menus, { recordId: params.id }, params).perform();
        },
        delete_menus: async (obj, params) => {
          return await new Liana.ResourceRemover(models.menus, { recordId: params.id }).perform();
        },
      }
    }
  };
}
