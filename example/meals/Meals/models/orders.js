module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('orders', {
    'customer_id': {
      type: DataTypes.INTEGER,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
    'delivery_address': {
      type: DataTypes.STRING,
    },
    'status': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'orders',
    underscored: true,
    
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

