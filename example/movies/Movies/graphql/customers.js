const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_customers(search: String, filter: JSON): Int
        list_customers(page: JSON, sort: String, search: String, filter: JSON): [customers!]
        get_customers(id: ID!): customers
      }

      extend type Mutation {
        create_customers(
          firstname: String,
          lastname: String,
          email: String,
          stripe_id: String,
          country: String,
          city: String,
          street_address: String,
          zip_code: String,
          state: String,
          created_at: DateTime,
          updated_at: DateTime,
          encrypted_password: String,
          reset_password_token: String,
          reset_password_sent_at: DateTime,
          remember_created_at: DateTime,
          sign_in_count: Int,
          current_sign_in_at: DateTime,
          last_sign_in_at: DateTime,
          gender: String,
        ): customers

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
          created_at: DateTime,
          updated_at: DateTime,
          encrypted_password: String,
          reset_password_token: String,
          reset_password_sent_at: DateTime,
          remember_created_at: DateTime,
          sign_in_count: Int,
          current_sign_in_at: DateTime,
          last_sign_in_at: DateTime,
          gender: String,
        ): customers

        delete_customers(id: ID!): Boolean
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
        created_at: DateTime
        updated_at: DateTime
        encrypted_password: String
        reset_password_token: String
        reset_password_sent_at: DateTime
        remember_created_at: DateTime
        sign_in_count: Int
        current_sign_in_at: DateTime
        last_sign_in_at: DateTime
        gender: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_customers: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.customers, opts, params).count();
        },
        list_customers: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.customers, opts, params).perform();
          return r[0];
        },
        get_customers: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.customers, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_customers: async (obj, params) => {
          return await new Liana.ResourceCreator(models.customers, params).perform();
        },
        update_customers: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.customers, { recordId: params.id }, params).perform();
        },
        delete_customers: async (obj, params) => {
          return await new Liana.ResourceRemover(models.customers, { recordId: params.id }).perform();
        },
      }
    }
  };
}
