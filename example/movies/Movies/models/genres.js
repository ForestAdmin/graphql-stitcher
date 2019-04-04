module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('genres', {
    'genre': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'genres',
    
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

