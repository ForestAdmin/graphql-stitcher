module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('menus', {
    'available_at': {
      type: DataTypes.DATE,
    },
    'chef_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'menus',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

