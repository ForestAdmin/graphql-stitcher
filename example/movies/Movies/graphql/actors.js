const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_actors: [actors!]
        get_actors(id: ID!): actors
      }

      extend type Mutation {
        update_actors(
          name: String,
        ): actors

        delete_actors(id: ID!): Boolean!
      }

      type actors {
        id: ID!
        name: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_actors: async () => {
          const r = await new Liana.ResourcesGetter(models.actors, {}, {}).perform();
          return r[0];
        },
        get_actors: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.actors, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_actors: async (obj, args) => {
          return await new Liana.ResourceRemover(models.actors, { recordId: args.id }).perform();
        },
        update_actors: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.actors, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

