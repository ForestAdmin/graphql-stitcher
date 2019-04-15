const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_delivery_men(search: String, filter: JSON): Int
        list_delivery_men(page: JSON, sort: String, search: String, filter: JSON): [delivery_men!]
        get_delivery_men(id: ID!): delivery_men
      }

      extend type Mutation {
        create_delivery_men(
          firstname: String,
          lastname: String,
          email: String,
          phone: String,
          location: String,
          available: Boolean,
          created_at: DateTime,
          updated_at: DateTime,
          geoloc: String,
        ): delivery_men

        update_delivery_men(
          firstname: String,
          lastname: String,
          email: String,
          phone: String,
          location: String,
          available: Boolean,
          created_at: DateTime,
          updated_at: DateTime,
          geoloc: String,
        ): delivery_men

        delete_delivery_men(id: ID!): Boolean
      }

      type delivery_men {
        id: ID!
        firstname: String
        lastname: String
        email: String
        phone: String
        location: String
        available: Boolean
        created_at: DateTime
        updated_at: DateTime
        geoloc: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_delivery_men: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.delivery_men, opts, params).count();
        },
        list_delivery_men: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.delivery_men, opts, params).perform();
          return r[0];
        },
        get_delivery_men: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.delivery_men, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_delivery_men: async (obj, params) => {
          return await new Liana.ResourceCreator(models.delivery_men, params).perform();
        },
        update_delivery_men: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.delivery_men, { recordId: params.id }, params).perform();
        },
        delete_delivery_men: async (obj, params) => {
          return await new Liana.ResourceRemover(models.delivery_men, { recordId: params.id }).perform();
        },
      }
    }
  };
}
