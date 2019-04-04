const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_genres_movies: [genres_movies!]
        get_genres_movies(id: ID!): genres_movies
      }

      extend type Mutation {
        update_genres_movies(
          movie_id: String,
          genre_id: String,
        ): genres_movies

        delete_genres_movies(id: ID!): Boolean!
      }

      type genres_movies {
        movie_id: String
        genre_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_genres_movies: async () => {
          const r = await new Liana.ResourcesGetter(models.genres_movies, {}, {}).perform();
          return r[0];
        },
        get_genres_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.genres_movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_genres_movies: async (obj, args) => {
          return await new Liana.ResourceRemover(models.genres_movies, { recordId: args.id }).perform();
        },
        update_genres_movies: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.genres_movies, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

