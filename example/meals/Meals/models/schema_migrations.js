module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('schema_migrations', {
    'version': {
      type: DataTypes.STRING,
      primaryKey: true 
    },
  }, {
    tableName: 'schema_migrations',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

