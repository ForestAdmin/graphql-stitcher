const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_chef_availabilities: [chef_availabilities!]
        get_chef_availabilities(id: ID!): chef_availabilities
      }

      extend type Mutation {
        update_chef_availabilities(
          chef_id: String,
          available_at: String,
        ): chef_availabilities

        delete_chef_availabilities(id: ID!): Boolean!
      }

      type chef_availabilities {
        id: ID!
        chef_id: String
        available_at: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_chef_availabilities: async () => {
          const r = await new Liana.ResourcesGetter(models.chef_availabilities, {}, {}).perform();
          return r[0];
        },
        get_chef_availabilities: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.chef_availabilities, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_chef_availabilities: async (obj, args) => {
          return await new Liana.ResourceRemover(models.chef_availabilities, { recordId: args.id }).perform();
        },
        update_chef_availabilities: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.chef_availabilities, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

