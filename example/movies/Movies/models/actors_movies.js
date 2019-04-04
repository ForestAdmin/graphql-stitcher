module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('actors_movies', {
    'movie_id': {
      type: DataTypes.INTEGER,
    },
    'actor_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'actors_movies',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

