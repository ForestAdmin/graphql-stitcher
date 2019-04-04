module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('countries_movies', {
    'movie_id': {
      type: DataTypes.INTEGER,
    },
    'country_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'countries_movies',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

