const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_delivery_men: [delivery_men!]
        get_delivery_men(id: ID!): delivery_men
      }

      extend type Mutation {
        update_delivery_men(
          firstname: String,
          lastname: String,
          email: String,
          phone: String,
          location: String,
          available: String,
          created_at: String,
          updated_at: String,
          geoloc: String,
        ): delivery_men

        delete_delivery_men(id: ID!): Boolean!
      }

      type delivery_men {
        id: ID!
        firstname: String
        lastname: String
        email: String
        phone: String
        location: String
        available: String
        created_at: String
        updated_at: String
        geoloc: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_delivery_men: async () => {
          const r = await new Liana.ResourcesGetter(models.delivery_men, {}, {}).perform();
          return r[0];
        },
        get_delivery_men: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.delivery_men, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_delivery_men: async (obj, args) => {
          return await new Liana.ResourceRemover(models.delivery_men, { recordId: args.id }).perform();
        },
        update_delivery_men: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.delivery_men, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

