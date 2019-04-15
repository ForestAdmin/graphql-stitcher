module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('actors', {
    'name': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'actors',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

