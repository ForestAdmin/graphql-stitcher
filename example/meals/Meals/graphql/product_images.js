const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_product_images(search: String, filter: JSON): Int
        list_product_images(page: JSON, sort: String, search: String, filter: JSON): [product_images!]
        get_product_images(id: ID!): product_images
      }

      extend type Mutation {
        create_product_images(
          product_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
          image_file_name: String,
          image_content_type: String,
          image_file_size: Int,
          image_updated_at: DateTime,
        ): product_images

        update_product_images(
          product_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
          image_file_name: String,
          image_content_type: String,
          image_file_size: Int,
          image_updated_at: DateTime,
        ): product_images

        delete_product_images(id: ID!): Boolean
      }

      type product_images {
        id: ID!
        product_id: Int
        created_at: DateTime
        updated_at: DateTime
        image_file_name: String
        image_content_type: String
        image_file_size: Int
        image_updated_at: DateTime
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_product_images: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.product_images, opts, params).count();
        },
        list_product_images: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.product_images, opts, params).perform();
          return r[0];
        },
        get_product_images: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.product_images, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_product_images: async (obj, params) => {
          return await new Liana.ResourceCreator(models.product_images, params).perform();
        },
        update_product_images: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.product_images, { recordId: params.id }, params).perform();
        },
        delete_product_images: async (obj, params) => {
          return await new Liana.ResourceRemover(models.product_images, { recordId: params.id }).perform();
        },
      }
    }
  };
}
