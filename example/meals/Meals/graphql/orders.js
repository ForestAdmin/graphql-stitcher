const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_orders: [orders!]
        get_orders(id: ID!): orders
      }

      extend type Mutation {
        update_orders(
          customer_id: String,
          created_at: String,
          updated_at: String,
          delivery_address: String,
          status: String,
        ): orders

        delete_orders(id: ID!): Boolean!
      }

      type orders {
        id: ID!
        customer_id: String
        created_at: String
        updated_at: String
        delivery_address: String
        status: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_orders: async () => {
          const r = await new Liana.ResourcesGetter(models.orders, {}, {}).perform();
          return r[0];
        },
        get_orders: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.orders, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_orders: async (obj, args) => {
          return await new Liana.ResourceRemover(models.orders, { recordId: args.id }).perform();
        },
        update_orders: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.orders, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

