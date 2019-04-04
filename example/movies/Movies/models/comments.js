module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('comments', {
    'comment': {
      type: DataTypes.STRING,
    },
    'customer_id': {
      type: DataTypes.INTEGER,
    },
    'movie_id': {
      type: DataTypes.INTEGER,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
    'status': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'comments',
    underscored: true,
    
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

