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
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

