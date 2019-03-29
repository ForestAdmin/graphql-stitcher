const gql = require('apollo-server-express').gql;

module.exports = function () {
  this.getSchema = function () {
    return gql`
      extend type Query {
        list_users: [User!]
      }

      type User {
        id: ID!
        firstname: String
        lastname: String
        email: String
      }
    `;
  };

  this.getResolver = function () {
    return {
      Query: {
        list_users: async () => {
          return [{
            id: 1,
            firstname: 'Sandro',
            lastname: 'Munda',
            email: 'sandro@munda.me',
          }];
        },
      },
    }
  };
}
