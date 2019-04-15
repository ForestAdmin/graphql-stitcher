const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_actor_images(search: String, filter: JSON): Int
        list_actor_images(page: JSON, sort: String, search: String, filter: JSON): [actor_images!]
        get_actor_images(id: ID!): actor_images
      }

      extend type Mutation {
        create_actor_images(
          url: String,
          actor_id: Int,
        ): actor_images

        update_actor_images(
          url: String,
          actor_id: Int,
        ): actor_images

        delete_actor_images(id: ID!): Boolean
      }

      type actor_images {
        id: ID!
        url: String
        actor_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_actor_images: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.actor_images, opts, params).count();
        },
        list_actor_images: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.actor_images, opts, params).perform();
          return r[0];
        },
        get_actor_images: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.actor_images, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_actor_images: async (obj, params) => {
          return await new Liana.ResourceCreator(models.actor_images, params).perform();
        },
        update_actor_images: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.actor_images, { recordId: params.id }, params).perform();
        },
        delete_actor_images: async (obj, params) => {
          return await new Liana.ResourceRemover(models.actor_images, { recordId: params.id }).perform();
        },
      }
    }
  };
}
