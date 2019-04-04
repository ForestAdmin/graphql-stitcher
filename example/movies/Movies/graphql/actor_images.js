const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_actor_images: [actor_images!]
        get_actor_images(id: ID!): actor_images
      }

      extend type Mutation {
        update_actor_images(
          url: String,
          actor_id: String,
        ): actor_images

        delete_actor_images(id: ID!): Boolean!
      }

      type actor_images {
        id: ID!
        url: String
        actor_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_actor_images: async () => {
          const r = await new Liana.ResourcesGetter(models.actor_images, {}, {}).perform();
          return r[0];
        },
        get_actor_images: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.actor_images, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_actor_images: async (obj, args) => {
          return await new Liana.ResourceRemover(models.actor_images, { recordId: args.id }).perform();
        },
        update_actor_images: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.actor_images, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

