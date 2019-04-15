const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_countries(search: String, filter: JSON): Int
        list_countries(page: JSON, sort: String, search: String, filter: JSON): [countries!]
        get_countries(id: ID!): countries
      }

      extend type Mutation {
        create_countries(
          name: String,
        ): countries

        update_countries(
          name: String,
        ): countries

        delete_countries(id: ID!): Boolean
      }

      type countries {
        id: ID!
        name: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_countries: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.countries, opts, params).count();
        },
        list_countries: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.countries, opts, params).perform();
          return r[0];
        },
        get_countries: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.countries, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_countries: async (obj, params) => {
          return await new Liana.ResourceCreator(models.countries, params).perform();
        },
        update_countries: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.countries, { recordId: params.id }, params).perform();
        },
        delete_countries: async (obj, params) => {
          return await new Liana.ResourceRemover(models.countries, { recordId: params.id }).perform();
        },
      }
    }
  };
}
