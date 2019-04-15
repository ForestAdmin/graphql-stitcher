module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('product_images', {
    'product_id': {
      type: DataTypes.INTEGER,
    },
    'created_at': {
      type: DataTypes.DATE,
    },
    'updated_at': {
      type: DataTypes.DATE,
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
  }, {
    tableName: 'product_images',
    underscored: true,
    
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

