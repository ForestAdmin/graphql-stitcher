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
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

