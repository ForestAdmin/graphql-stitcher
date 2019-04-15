module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('customers', {
    'firstname': {
      type: DataTypes.STRING,
    },
    'lastname': {
      type: DataTypes.STRING,
    },
    'address': {
      type: DataTypes.STRING,
    },
    'phone': {
      type: DataTypes.STRING,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
    'stripe_id': {
      type: DataTypes.STRING,
    },
    'bulk_action_started_by': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'customers',
    underscored: true,
    
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

