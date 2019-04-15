const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_products(search: String, filter: JSON): Int
        list_products(page: JSON, sort: String, search: String, filter: JSON): [products!]
        get_products(id: ID!): products
      }

      extend type Mutation {
        create_products(
          title: String,
          description: String,
          instructions: String,
          created_at: DateTime,
          updated_at: DateTime,
          product_type: Int,
          image_file_name: String,
          image_content_type: String,
          image_file_size: Int,
          image_updated_at: DateTime,
          price: Float,
        ): products

        update_products(
          title: String,
          description: String,
          instructions: String,
          created_at: DateTime,
          updated_at: DateTime,
          product_type: Int,
          image_file_name: String,
          image_content_type: String,
          image_file_size: Int,
          image_updated_at: DateTime,
          price: Float,
        ): products

        delete_products(id: ID!): Boolean
      }

      type products {
        id: ID!
        title: String
        description: String
        instructions: String
        created_at: DateTime
        updated_at: DateTime
        product_type: Int
        image_file_name: String
        image_content_type: String
        image_file_size: Int
        image_updated_at: DateTime
        price: Float
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_products: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.products, opts, params).count();
        },
        list_products: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.products, opts, params).perform();
          return r[0];
        },
        get_products: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.products, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_products: async (obj, params) => {
          return await new Liana.ResourceCreator(models.products, params).perform();
        },
        update_products: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.products, { recordId: params.id }, params).perform();
        },
        delete_products: async (obj, params) => {
          return await new Liana.ResourceRemover(models.products, { recordId: params.id }).perform();
        },
      }
    }
  };
}
