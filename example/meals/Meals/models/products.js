module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('products', {
    'title': {
      type: DataTypes.STRING,
    },
    'description': {
      type: DataTypes.STRING,
    },
    'instructions': {
      type: DataTypes.STRING,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
    },
    'product_type': {
      type: DataTypes.INTEGER,
    },
    'image_file_name': {
      type: DataTypes.STRING,
    },
    'image_content_type': {
      type: DataTypes.STRING,
    },
    'image_file_size': {
      type: DataTypes.INTEGER,
    },
    'image_updated_at': {
      type: DataTypes.DATE,
    },
    'price': {
      type: DataTypes.DOUBLE,
    },
  }, {
    tableName: 'products',
    underscored: true,
    
    schema: process.env.DATABASE_SCHEMA,
  });

  Model.associate = (models) => {
  };

  return Model;
};

