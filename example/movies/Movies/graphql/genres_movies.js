const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_genres_movies(search: String, filter: JSON): Int
        list_genres_movies(page: JSON, sort: String, search: String, filter: JSON): [genres_movies!]
        get_genres_movies(id: ID!): genres_movies
      }

      extend type Mutation {
        create_genres_movies(
          movie_id: Int,
          genre_id: Int,
        ): genres_movies

        update_genres_movies(
          movie_id: Int,
          genre_id: Int,
        ): genres_movies

        delete_genres_movies(id: ID!): Boolean
      }

      type genres_movies {
        movie_id: Int
        genre_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_genres_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.genres_movies, opts, params).count();
        },
        list_genres_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.genres_movies, opts, params).perform();
          return r[0];
        },
        get_genres_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.genres_movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_genres_movies: async (obj, params) => {
          return await new Liana.ResourceCreator(models.genres_movies, params).perform();
        },
        update_genres_movies: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.genres_movies, { recordId: params.id }, params).perform();
        },
        delete_genres_movies: async (obj, params) => {
          return await new Liana.ResourceRemover(models.genres_movies, { recordId: params.id }).perform();
        },
      }
    }
  };
}
