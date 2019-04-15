module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('countries', {
    'name': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'countries',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

