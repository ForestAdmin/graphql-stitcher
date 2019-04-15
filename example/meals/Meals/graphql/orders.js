const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_orders(search: String, filter: JSON): Int
        list_orders(page: JSON, sort: String, search: String, filter: JSON): [orders!]
        get_orders(id: ID!): orders
      }

      extend type Mutation {
        create_orders(
          customer_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
          delivery_address: String,
          status: Int,
        ): orders

        update_orders(
          customer_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
          delivery_address: String,
          status: Int,
        ): orders

        delete_orders(id: ID!): Boolean
      }

      type orders {
        id: ID!
        customer_id: Int
        created_at: DateTime
        updated_at: DateTime
        delivery_address: String
        status: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_orders: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.orders, opts, params).count();
        },
        list_orders: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.orders, opts, params).perform();
          return r[0];
        },
        get_orders: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.orders, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_orders: async (obj, params) => {
          return await new Liana.ResourceCreator(models.orders, params).perform();
        },
        update_orders: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.orders, { recordId: params.id }, params).perform();
        },
        delete_orders: async (obj, params) => {
          return await new Liana.ResourceRemover(models.orders, { recordId: params.id }).perform();
        },
      }
    }
  };
}
