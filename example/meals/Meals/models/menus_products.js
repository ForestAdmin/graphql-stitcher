module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('menus_products', {
    'product_id': {
      type: DataTypes.INTEGER,
    },
    'menu_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'menus_products',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

