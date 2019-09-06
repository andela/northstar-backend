module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define('Facility', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number_of_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    description: {
      type: DataTypes.STRING
    },
    available_space: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'facilities',
    underscored: true
  });
  Facility.associate = (models) => {
    Facility.hasMany(models.Like, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE',
      constraints: false
    });
  };
  return Facility;
};
