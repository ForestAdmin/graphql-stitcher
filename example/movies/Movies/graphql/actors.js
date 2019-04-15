const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_actors(search: String, filter: JSON): Int
        list_actors(page: JSON, sort: String, search: String, filter: JSON): [actors!]
        get_actors(id: ID!): actors
      }

      extend type Mutation {
        create_actors(
          name: String,
        ): actors

        update_actors(
          name: String,
        ): actors

        delete_actors(id: ID!): Boolean
      }

      type actors {
        id: ID!
        name: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_actors: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.actors, opts, params).count();
        },
        list_actors: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.actors, opts, params).perform();
          return r[0];
        },
        get_actors: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.actors, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_actors: async (obj, params) => {
          return await new Liana.ResourceCreator(models.actors, params).perform();
        },
        update_actors: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.actors, { recordId: params.id }, params).perform();
        },
        delete_actors: async (obj, params) => {
          return await new Liana.ResourceRemover(models.actors, { recordId: params.id }).perform();
        },
      }
    }
  };
}
