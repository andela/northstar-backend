module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define('Amenity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'amenities',
    underscored: true
  });
  Amenity.associate = (models) => (
    Amenity.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      oneDelete: 'CASCADE'
    })
  );
  return Amenity;
};
