module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('genres_movies', {
    'movie_id': {
      type: DataTypes.INTEGER,
    },
    'genre_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'genres_movies',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

