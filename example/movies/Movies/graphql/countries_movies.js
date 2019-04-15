const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_countries_movies(search: String, filter: JSON): Int
        list_countries_movies(page: JSON, sort: String, search: String, filter: JSON): [countries_movies!]
        get_countries_movies(id: ID!): countries_movies
      }

      extend type Mutation {
        create_countries_movies(
          movie_id: Int,
          country_id: Int,
        ): countries_movies

        update_countries_movies(
          movie_id: Int,
          country_id: Int,
        ): countries_movies

        delete_countries_movies(id: ID!): Boolean
      }

      type countries_movies {
        movie_id: Int
        country_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_countries_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.countries_movies, opts, params).count();
        },
        list_countries_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.countries_movies, opts, params).perform();
          return r[0];
        },
        get_countries_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.countries_movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_countries_movies: async (obj, params) => {
          return await new Liana.ResourceCreator(models.countries_movies, params).perform();
        },
        update_countries_movies: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.countries_movies, { recordId: params.id }, params).perform();
        },
        delete_countries_movies: async (obj, params) => {
          return await new Liana.ResourceRemover(models.countries_movies, { recordId: params.id }).perform();
        },
      }
    }
  };
}
