const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_customers: [customers!]
        get_customers(id: ID!): customers
      }

      extend type Mutation {
        update_customers(
          firstname: String,
          lastname: String,
          address: String,
          phone: String,
          created_at: String,
          updated_at: String,
          stripe_id: String,
          bulk_action_started_by: String,
        ): customers

        delete_customers(id: ID!): Boolean!
      }

      type customers {
        id: ID!
        firstname: String
        lastname: String
        address: String
        phone: String
        created_at: String
        updated_at: String
        stripe_id: String
        bulk_action_started_by: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_customers: async () => {
          const r = await new Liana.ResourcesGetter(models.customers, {}, {}).perform();
          return r[0];
        },
        get_customers: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.customers, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_customers: async (obj, args) => {
          return await new Liana.ResourceRemover(models.customers, { recordId: args.id }).perform();
        },
        update_customers: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.customers, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

