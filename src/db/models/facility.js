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
    },
    checked_in_users: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
  }, {
    tableName: 'facilities',
    underscored: true
  });
  Facility.associate = () => {
    // associations can be defined here
    // The parameter "models" was removed because it is not in use
  };
  return Facility;
};
