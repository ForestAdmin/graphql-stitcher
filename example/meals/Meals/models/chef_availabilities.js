module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('chef_availabilities', {
    'chef_id': {
      type: DataTypes.INTEGER,
    },
    'available_at': {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'chef_availabilities',
    underscored: true,
    timestamps: false,
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

