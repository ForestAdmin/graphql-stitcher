const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_chefs(search: String, filter: JSON): Int
        list_chefs(page: JSON, sort: String, search: String, filter: JSON): [chefs!]
        get_chefs(id: ID!): chefs
      }

      extend type Mutation {
        create_chefs(
          firstname: String,
          lastname: String,
          email: String,
          phone: String,
          address: String,
          created_at: DateTime,
          updated_at: DateTime,
        ): chefs

        update_chefs(
          firstname: String,
          lastname: String,
          email: String,
          phone: String,
          address: String,
          created_at: DateTime,
          updated_at: DateTime,
        ): chefs

        delete_chefs(id: ID!): Boolean
      }

      type chefs {
        id: ID!
        firstname: String
        lastname: String
        email: String
        phone: String
        address: String
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
        count_chefs: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.chefs, opts, params).count();
        },
        list_chefs: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.chefs, opts, params).perform();
          return r[0];
        },
        get_chefs: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.chefs, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_chefs: async (obj, params) => {
          return await new Liana.ResourceCreator(models.chefs, params).perform();
        },
        update_chefs: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.chefs, { recordId: params.id }, params).perform();
        },
        delete_chefs: async (obj, params) => {
          return await new Liana.ResourceRemover(models.chefs, { recordId: params.id }).perform();
        },
      }
    }
  };
}
