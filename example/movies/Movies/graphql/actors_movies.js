const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_actors_movies: [actors_movies!]
        get_actors_movies(id: ID!): actors_movies
      }

      extend type Mutation {
        update_actors_movies(
          movie_id: String,
          actor_id: String,
        ): actors_movies

        delete_actors_movies(id: ID!): Boolean!
      }

      type actors_movies {
        movie_id: String
        actor_id: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_actors_movies: async () => {
          const r = await new Liana.ResourcesGetter(models.actors_movies, {}, {}).perform();
          return r[0];
        },
        get_actors_movies: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.actors_movies, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_actors_movies: async (obj, args) => {
          return await new Liana.ResourceRemover(models.actors_movies, { recordId: args.id }).perform();
        },
        update_actors_movies: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.actors_movies, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

