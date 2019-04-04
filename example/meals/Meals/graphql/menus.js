const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_menus: [menus!]
        get_menus(id: ID!): menus
      }

      extend type Mutation {
        update_menus(
          available_at: String,
          chef_id: String,
        ): menus

        delete_menus(id: ID!): Boolean!
      }

      type menus {
        id: ID!
        available_at: String
        chef_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_menus: async () => {
          const r = await new Liana.ResourcesGetter(models.menus, {}, {}).perform();
          return r[0];
        },
        get_menus: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.menus, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_menus: async (obj, args) => {
          return await new Liana.ResourceRemover(models.menus, { recordId: args.id }).perform();
        },
        update_menus: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.menus, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

