const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

const { GraphQLDateTime } = require('graphql-iso-date');
const GraphQLJSON = require('graphql-type-json');

module.exports = function (opts) {
  this.getSchema = function () {
    return gql`
      extend type Query {
        count_comments(search: String, filter: JSON): Int
        list_comments(page: JSON, sort: String, search: String, filter: JSON): [comments!]
        get_comments(id: ID!): comments
      }

      extend type Mutation {
        create_comments(
          comment: String,
          customer_id: Int,
          movie_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
          status: Int,
        ): comments

        update_comments(
          comment: String,
          customer_id: Int,
          movie_id: Int,
          created_at: DateTime,
          updated_at: DateTime,
          status: Int,
        ): comments

        delete_comments(id: ID!): Boolean
      }

      type comments {
        id: ID!
        comment: String
        customer_id: Int
        movie_id: Int
        created_at: DateTime
        updated_at: DateTime
        status: Int
      }
    `;
  };

  this.getResolver = function () {
    return {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      Query: {
        count_comments: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          return await new Liana.ResourcesGetter(models.comments, opts, params).count();
        },
        list_comments: async (obj, params) => {
          if (!params.filterType) { params.filterType = 'and'; }
          if (!params.timezone) { params.timezone = 'Europe/London'; }

          const r = await new Liana.ResourcesGetter(models.comments, opts, params).perform();
          return r[0];
        },
        get_comments: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.comments, { recordId: id }).perform();
        },
      },
      Mutation: {
        create_comments: async (obj, params) => {
          return await new Liana.ResourceCreator(models.comments, params).perform();
        },
        update_comments: async (obj, params) => {
          return await new Liana.ResourceUpdater(models.comments, { recordId: params.id }, params).perform();
        },
        delete_comments: async (obj, params) => {
          return await new Liana.ResourceRemover(models.comments, { recordId: params.id }).perform();
        },
      }
    }
  };
}
