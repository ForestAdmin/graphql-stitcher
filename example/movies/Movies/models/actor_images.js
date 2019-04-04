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
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

