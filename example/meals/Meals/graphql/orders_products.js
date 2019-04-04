const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_orders_products: [orders_products!]
        get_orders_products(id: ID!): orders_products
      }

      extend type Mutation {
        update_orders_products(
          order_id: String,
          product_id: String,
        ): orders_products

        delete_orders_products(id: ID!): Boolean!
      }

      type orders_products {
        id: ID!
        order_id: String
        product_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_orders_products: async () => {
          const r = await new Liana.ResourcesGetter(models.orders_products, {}, {}).perform();
          return r[0];
        },
        get_orders_products: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.orders_products, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_orders_products: async (obj, args) => {
          return await new Liana.ResourceRemover(models.orders_products, { recordId: args.id }).perform();
        },
        update_orders_products: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.orders_products, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

