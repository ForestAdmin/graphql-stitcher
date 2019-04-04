module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('delivery_men', {
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
    'location': {
      type: DataTypes.STRING,
    },
    'available': {
      type: DataTypes.BOOLEAN,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
    'geoloc': {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'delivery_men',
    underscored: true,
    
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

