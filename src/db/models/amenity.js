module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define('Amenity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facilities',
        key: 'id',
        as: 'facility_id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'amenities',
    underscored: true
  });
  Amenity.associate = () => {
    // associations can be defined here
    // removed the parameter "models" because it is not being used
  };
  return Amenity;
};
