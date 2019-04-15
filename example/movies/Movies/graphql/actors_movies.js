const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_actors_movies(search: String, filter: JSON): Int
        list_actors_movies(page: JSON, sort: String, search: String, filter: JSON): [actors_movies!]
        get_actors_movies(id: ID!): actors_movies
      }

      extend type Mutation {
        create_actors_movies(
          movie_id: Int,
          actor_id: Int,
        ): actors_movies

        update_actors_movies(
          movie_id: Int,
          actor_id: Int,
        ): actors_movies

        delete_actors_movies(id: ID!): Boolean
      }

      type actors_movies {
        movie_id: Int
        actor_id: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_actors_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.actors_movies, opts, params).count();
        },
        list_actors_movies: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.actors_movies, opts, params).perform();
          return r[0];
        },
        get_actors_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.actors_movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_actors_movies: async (obj, params) => {
          return await new Liana.ResourceCreator(models.actors_movies, params).perform();
        },
        update_actors_movies: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.actors_movies, { recordId: params.id }, params).perform();
        },
        delete_actors_movies: async (obj, params) => {
          return await new Liana.ResourceRemover(models.actors_movies, { recordId: params.id }).perform();
        },
      }
    }
  };
}
