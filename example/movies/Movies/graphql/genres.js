const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_genres: [genres!]
        get_genres(id: ID!): genres
      }

      extend type Mutation {
        update_genres(
          genre: String,
        ): genres

        delete_genres(id: ID!): Boolean!
      }

      type genres {
        id: ID!
        genre: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_genres: async () => {
          const r = await new Liana.ResourcesGetter(models.genres, {}, {}).perform();
          return r[0];
        },
        get_genres: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.genres, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_genres: async (obj, args) => {
          return await new Liana.ResourceRemover(models.genres, { recordId: args.id }).perform();
        },
        update_genres: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.genres, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

