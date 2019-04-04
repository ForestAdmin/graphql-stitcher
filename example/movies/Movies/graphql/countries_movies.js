const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_countries_movies: [countries_movies!]
        get_countries_movies(id: ID!): countries_movies
      }

      extend type Mutation {
        update_countries_movies(
          movie_id: String,
          country_id: String,
        ): countries_movies

        delete_countries_movies(id: ID!): Boolean!
      }

      type countries_movies {
        movie_id: String
        country_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_countries_movies: async () => {
          const r = await new Liana.ResourcesGetter(models.countries_movies, {}, {}).perform();
          return r[0];
        },
        get_countries_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.countries_movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_countries_movies: async (obj, args) => {
          return await new Liana.ResourceRemover(models.countries_movies, { recordId: args.id }).perform();
        },
        update_countries_movies: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.countries_movies, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

