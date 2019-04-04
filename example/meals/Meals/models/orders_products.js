module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('orders_products', {
    'order_id': {
      type: DataTypes.INTEGER,
    },
    'product_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'orders_products',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

