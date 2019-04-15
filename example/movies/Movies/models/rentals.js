module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('rentals', {
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
  }, {
    tableName: 'rentals',
    underscored: true,
    
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

