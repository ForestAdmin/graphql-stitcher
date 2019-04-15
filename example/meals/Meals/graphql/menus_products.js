const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_menus_products(search: String, filter: JSON): Int
        list_menus_products(page: JSON, sort: String, search: String, filter: JSON): [menus_products!]
        get_menus_products(id: ID!): menus_products
      }

      extend type Mutation {
        create_menus_products(
          product_id: Int,
          menu_id: Int,
        ): menus_products

        update_menus_products(
          product_id: Int,
          menu_id: Int,
        ): menus_products

        delete_menus_products(id: ID!): Boolean
      }

      type menus_products {
        id: ID!
        product_id: Int
        menu_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_menus_products: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.menus_products, opts, params).count();
        },
        list_menus_products: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.menus_products, opts, params).perform();
          return r[0];
        },
        get_menus_products: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.menus_products, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_menus_products: async (obj, params) => {
          return await new Liana.ResourceCreator(models.menus_products, params).perform();
        },
        update_menus_products: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.menus_products, { recordId: params.id }, params).perform();
        },
        delete_menus_products: async (obj, params) => {
          return await new Liana.ResourceRemover(models.menus_products, { recordId: params.id }).perform();
        },
      }
    }
  };
}
