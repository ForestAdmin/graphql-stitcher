const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_rentals: [rentals!]
        get_rentals(id: ID!): rentals
      }

      extend type Mutation {
        update_rentals(
          customer_id: String,
          movie_id: String,
          created_at: String,
          updated_at: String,
        ): rentals

        delete_rentals(id: ID!): Boolean!
      }

      type rentals {
        id: ID!
        customer_id: String
        movie_id: String
        created_at: String
        updated_at: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_rentals: async () => {
          const r = await new Liana.ResourcesGetter(models.rentals, {}, {}).perform();
          return r[0];
        },
        get_rentals: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.rentals, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_rentals: async (obj, args) => {
          return await new Liana.ResourceRemover(models.rentals, { recordId: args.id }).perform();
        },
        update_rentals: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.rentals, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

