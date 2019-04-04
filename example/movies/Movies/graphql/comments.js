const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_comments: [comments!]
        get_comments(id: ID!): comments
      }

      extend type Mutation {
        update_comments(
          comment: String,
          customer_id: String,
          movie_id: String,
          created_at: String,
          updated_at: String,
          status: String,
        ): comments

        delete_comments(id: ID!): Boolean!
      }

      type comments {
        id: ID!
        comment: String
        customer_id: String
        movie_id: String
        created_at: String
        updated_at: String
        status: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_comments: async () => {
          const r = await new Liana.ResourcesGetter(models.comments, {}, {}).perform();
          return r[0];
        },
        get_comments: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.comments, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_comments: async (obj, args) => {
          return await new Liana.ResourceRemover(models.comments, { recordId: args.id }).perform();
        },
        update_comments: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.comments, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

