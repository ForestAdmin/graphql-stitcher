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
          email: String,
          stripe_id: String,
          country: String,
          city: String,
          street_address: String,
          zip_code: String,
          state: String,
          created_at: String,
          updated_at: String,
          encrypted_password: String,
          reset_password_token: String,
          reset_password_sent_at: String,
          remember_created_at: String,
          sign_in_count: String,
          current_sign_in_at: String,
          last_sign_in_at: String,
          gender: String,
        ): customers

        delete_customers(id: ID!): Boolean!
      }

      type customers {
        id: ID!
        firstname: String
        lastname: String
        email: String
        stripe_id: String
        country: String
        city: String
        street_address: String
        zip_code: String
        state: String
        created_at: String
        updated_at: String
        encrypted_password: String
        reset_password_token: String
        reset_password_sent_at: String
        remember_created_at: String
        sign_in_count: String
        current_sign_in_at: String
        last_sign_in_at: String
        gender: String
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

