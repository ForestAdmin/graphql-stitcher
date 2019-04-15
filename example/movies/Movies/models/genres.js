module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('genres', {
    'genre': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'genres',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

