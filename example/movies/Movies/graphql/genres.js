const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_genres(search: String, filter: JSON): Int
        list_genres(page: JSON, sort: String, search: String, filter: JSON): [genres!]
        get_genres(id: ID!): genres
      }

      extend type Mutation {
        create_genres(
          genre: String,
        ): genres

        update_genres(
          genre: String,
        ): genres

        delete_genres(id: ID!): Boolean
      }

      type genres {
        id: ID!
        genre: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_genres: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.genres, opts, params).count();
        },
        list_genres: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.genres, opts, params).perform();
          return r[0];
        },
        get_genres: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.genres, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_genres: async (obj, params) => {
          return await new Liana.ResourceCreator(models.genres, params).perform();
        },
        update_genres: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.genres, { recordId: params.id }, params).perform();
        },
        delete_genres: async (obj, params) => {
          return await new Liana.ResourceRemover(models.genres, { recordId: params.id }).perform();
        },
      }
    }
  };
}
