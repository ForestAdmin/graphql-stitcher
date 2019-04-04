const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_product_images: [product_images!]
        get_product_images(id: ID!): product_images
      }

      extend type Mutation {
        update_product_images(
          product_id: String,
          created_at: String,
          updated_at: String,
          image_file_name: String,
          image_content_type: String,
          image_file_size: String,
          image_updated_at: String,
        ): product_images

        delete_product_images(id: ID!): Boolean!
      }

      type product_images {
        id: ID!
        product_id: String
        created_at: String
        updated_at: String
        image_file_name: String
        image_content_type: String
        image_file_size: String
        image_updated_at: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_product_images: async () => {
          const r = await new Liana.ResourcesGetter(models.product_images, {}, {}).perform();
          return r[0];
        },
        get_product_images: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.product_images, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_product_images: async (obj, args) => {
          return await new Liana.ResourceRemover(models.product_images, { recordId: args.id }).perform();
        },
        update_product_images: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.product_images, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

