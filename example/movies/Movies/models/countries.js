module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('countries', {
    'name': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'countries',
    
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

