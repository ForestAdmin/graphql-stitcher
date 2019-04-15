module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('actor_images', {
    'url': {
      type: DataTypes.STRING,
    },
    'actor_id': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'actor_images',
    underscored: true,
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

