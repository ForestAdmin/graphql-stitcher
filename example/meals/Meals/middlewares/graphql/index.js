const models = require('../../models');

module.exports = function (app) {
  require('lumber-graphql').run(app, {
    Sequelize: models.Sequelize,
    sequelize: models.sequelize,
    modelsDir: __dirname + '/../../models',
    schemasDir: __dirname + '/../../graphql',
  });
};
