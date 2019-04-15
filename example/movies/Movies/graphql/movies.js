const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_movies(search: String, filter: JSON): Int
        list_movies(page: JSON, sort: String, search: String, filter: JSON): [movies!]
        get_movies(id: ID!): movies
      }

      extend type Mutation {
        create_movies(
          imdb_id: String,
          title: String,
          year: String,
          runtime: String,
          released: DateTime,
          imdb_rating: Float,
          imdb_votes: Float,
          short_plot: String,
          full_plot: String,
          language: String,
          country: String,
          awards: String,
          created_at: DateTime,
          updated_at: DateTime,
          price: Float,
          poster_file_name: String,
          poster_content_type: String,
          poster_file_size: Int,
          poster_updated_at: DateTime,
        ): movies

        update_movies(
          imdb_id: String,
          title: String,
          year: String,
          runtime: String,
          released: DateTime,
          imdb_rating: Float,
          imdb_votes: Float,
          short_plot: String,
          full_plot: String,
          language: String,
          country: String,
          awards: String,
          created_at: DateTime,
          updated_at: DateTime,
          price: Float,
          poster_file_name: String,
          poster_content_type: String,
          poster_file_size: Int,
          poster_updated_at: DateTime,
        ): movies

        delete_movies(id: ID!): Boolean
      }

      type movies {
        id: ID!
        imdb_id: String
        title: String
        year: String
        runtime: String
        released: DateTime
        imdb_rating: Float
        imdb_votes: Float
        short_plot: String
        full_plot: String
        language: String
        country: String
        awards: String
        created_at: DateTime
        updated_at: DateTime
        price: Float
        poster_file_name: String
        poster_content_type: String
        poster_file_size: Int
        poster_updated_at: DateTime
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.movies, opts, params).count();
        },
        list_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.movies, opts, params).perform();
          return r[0];
        },
        get_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_movies: async (obj, params) => {
          return await new Liana.ResourceCreator(models.movies, params).perform();
        },
        update_movies: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.movies, { recordId: params.id }, params).perform();
        },
        delete_movies: async (obj, params) => {
          return await new Liana.ResourceRemover(models.movies, { recordId: params.id }).perform();
        },
      }
    }
  };
}
