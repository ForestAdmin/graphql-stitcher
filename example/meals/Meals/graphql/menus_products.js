const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_menus_products: [menus_products!]
        get_menus_products(id: ID!): menus_products
      }

      extend type Mutation {
        update_menus_products(
          product_id: String,
          menu_id: String,
        ): menus_products

        delete_menus_products(id: ID!): Boolean!
      }

      type menus_products {
        id: ID!
        product_id: String
        menu_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_menus_products: async () => {
          const r = await new Liana.ResourcesGetter(models.menus_products, {}, {}).perform();
          return r[0];
        },
        get_menus_products: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.menus_products, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_menus_products: async (obj, args) => {
          return await new Liana.ResourceRemover(models.menus_products, { recordId: args.id }).perform();
        },
        update_menus_products: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.menus_products, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

