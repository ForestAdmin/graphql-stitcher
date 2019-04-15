module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('chefs', {
    'firstname': {
      type: DataTypes.STRING,
    },
    'lastname': {
      type: DataTypes.STRING,
    },
    'email': {
      type: DataTypes.STRING,
    },
    'phone': {
      type: DataTypes.STRING,
    },
    'address': {
      type: DataTypes.STRING,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'chefs',
    underscored: true,
    
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

