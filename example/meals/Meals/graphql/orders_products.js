const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_orders_products(search: String, filter: JSON): Int
        list_orders_products(page: JSON, sort: String, search: String, filter: JSON): [orders_products!]
        get_orders_products(id: ID!): orders_products
      }

      extend type Mutation {
        create_orders_products(
          order_id: Int,
          product_id: Int,
        ): orders_products

        update_orders_products(
          order_id: Int,
          product_id: Int,
        ): orders_products

        delete_orders_products(id: ID!): Boolean
      }

      type orders_products {
        id: ID!
        order_id: Int
        product_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_orders_products: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.orders_products, opts, params).count();
        },
        list_orders_products: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.orders_products, opts, params).perform();
          return r[0];
        },
        get_orders_products: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.orders_products, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_orders_products: async (obj, params) => {
          return await new Liana.ResourceCreator(models.orders_products, params).perform();
        },
        update_orders_products: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.orders_products, { recordId: params.id }, params).perform();
        },
        delete_orders_products: async (obj, params) => {
          return await new Liana.ResourceRemover(models.orders_products, { recordId: params.id }).perform();
        },
      }
    }
  };
}
