module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('movies', {
    'imdb_id': {
      type: DataTypes.STRING,
    },
    'title': {
      type: DataTypes.STRING,
    },
    'year': {
      type: DataTypes.STRING,
    },
    'runtime': {
      type: DataTypes.STRING,
    },
    'released': {
      type: DataTypes.DATE,
    },
    'imdb_rating': {
      type: DataTypes.DOUBLE,
    },
    'imdb_votes': {
      type: DataTypes.DOUBLE,
    },
    'short_plot': {
      type: DataTypes.STRING,
    },
    'full_plot': {
      type: DataTypes.STRING,
    },
    'language': {
      type: DataTypes.STRING,
    },
    'country': {
      type: DataTypes.STRING,
    },
    'awards': {
      type: DataTypes.STRING,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
    'price': {
      type: DataTypes.DOUBLE,
    },
    'poster_file_name': {
      type: DataTypes.STRING,
    },
    'poster_content_type': {
      type: DataTypes.STRING,
    },
    'poster_file_size': {
      type: DataTypes.INTEGER,
    },
    'poster_updated_at': {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'movies',
    underscored: true,
    
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

