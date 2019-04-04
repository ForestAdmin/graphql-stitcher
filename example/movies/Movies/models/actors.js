module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('actors', {
    'name': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'actors',
    
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

