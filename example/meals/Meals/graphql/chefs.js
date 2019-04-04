const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_chefs: [chefs!]
        get_chefs(id: ID!): chefs
      }

      extend type Mutation {
        update_chefs(
          firstname: String,
          lastname: String,
          email: String,
          phone: String,
          address: String,
          created_at: String,
          updated_at: String,
        ): chefs

        delete_chefs(id: ID!): Boolean!
      }

      type chefs {
        id: ID!
        firstname: String
        lastname: String
        email: String
        phone: String
        address: String
        created_at: String
        updated_at: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_chefs: async () => {
          const r = await new Liana.ResourcesGetter(models.chefs, {}, {}).perform();
          return r[0];
        },
        get_chefs: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.chefs, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_chefs: async (obj, args) => {
          return await new Liana.ResourceRemover(models.chefs, { recordId: args.id }).perform();
        },
        update_chefs: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.chefs, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

