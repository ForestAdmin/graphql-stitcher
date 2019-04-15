const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_rentals(search: String, filter: JSON): Int
        list_rentals(page: JSON, sort: String, search: String, filter: JSON): [rentals!]
        get_rentals(id: ID!): rentals
      }

      extend type Mutation {
        create_rentals(
          customer_id: Int,
          movie_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
        ): rentals

        update_rentals(
          customer_id: Int,
          movie_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
        ): rentals

        delete_rentals(id: ID!): Boolean
      }

      type rentals {
        id: ID!
        customer_id: Int
        movie_id: Int
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
        count_rentals: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.rentals, opts, params).count();
        },
        list_rentals: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.rentals, opts, params).perform();
          return r[0];
        },
        get_rentals: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.rentals, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_rentals: async (obj, params) => {
          return await new Liana.ResourceCreator(models.rentals, params).perform();
        },
        update_rentals: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.rentals, { recordId: params.id }, params).perform();
        },
        delete_rentals: async (obj, params) => {
          return await new Liana.ResourceRemover(models.rentals, { recordId: params.id }).perform();
        },
      }
    }
  };
}
