const gql = require('apollo-server-express').gql;
const models = require('../models');
const Liana = require('forest-express-sequelize');

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_countries: [countries!]
        get_countries(id: ID!): countries
      }

      extend type Mutation {
        update_countries(
          name: String,
        ): countries

        delete_countries(id: ID!): Boolean!
      }

      type countries {
        id: ID!
        name: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_countries: async () => {
          const r = await new Liana.ResourcesGetter(models.countries, {}, {}).perform();
          return r[0];
        },
        get_countries: async (obj, { id }, context, info) => {
          return await new Liana.ResourceGetter(models.countries, { recordId: id }).perform();
        },
      },
      Mutation: {
        delete_countries: async (obj, args) => {
          return await new Liana.ResourceRemover(models.countries, { recordId: args.id }).perform();
        },
        update_countries: async (obj, args) => {
          return await new Liana.ResourceUpdater(models.countries, { recordId: args.id }, args).perform();
        }
      }
    }
  };
}

