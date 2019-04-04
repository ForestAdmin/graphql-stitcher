const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_products: [products!]
        get_products(id: ID!): products
      }

      extend type Mutation {
        update_products(
          title: String,
          description: String,
          instructions: String,
          created_at: String,
          updated_at: String,
          product_type: String,
          image_file_name: String,
          image_content_type: String,
          image_file_size: String,
          image_updated_at: String,
          price: String,
        ): products

        delete_products(id: ID!): Boolean!
      }

      type products {
        id: ID!
        title: String
        description: String
        instructions: String
        created_at: String
        updated_at: String
        product_type: String
        image_file_name: String
        image_content_type: String
        image_file_size: String
        image_updated_at: String
        price: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_products: async () => {
          const r = await new Liana.ResourcesGetter(models.products, {}, {}).perform();
          return r[0];
        },
        get_products: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.products, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_products: async (obj, args) => {
          return await new Liana.ResourceRemover(models.products, { recordId: args.id }).perform();
        },
        update_products: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.products, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

