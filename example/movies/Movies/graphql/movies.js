const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_movies: [movies!]
        get_movies(id: ID!): movies
      }

      extend type Mutation {
        update_movies(
          imdb_id: String,
          title: String,
          year: String,
          runtime: String,
          released: String,
          imdb_rating: String,
          imdb_votes: String,
          short_plot: String,
          full_plot: String,
          language: String,
          country: String,
          awards: String,
          created_at: String,
          updated_at: String,
          price: String,
          poster_file_name: String,
          poster_content_type: String,
          poster_file_size: String,
          poster_updated_at: String,
        ): movies

        delete_movies(id: ID!): Boolean!
      }

      type movies {
        id: ID!
        imdb_id: String
        title: String
        year: String
        runtime: String
        released: String
        imdb_rating: String
        imdb_votes: String
        short_plot: String
        full_plot: String
        language: String
        country: String
        awards: String
        created_at: String
        updated_at: String
        price: String
        poster_file_name: String
        poster_content_type: String
        poster_file_size: String
        poster_updated_at: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_movies: async () => {
          const r = await new Liana.ResourcesGetter(models.movies, {}, {}).perform();
          return r[0];
        },
        get_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_movies: async (obj, args) => {
          return await new Liana.ResourceRemover(models.movies, { recordId: args.id }).perform();
        },
        update_movies: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.movies, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

