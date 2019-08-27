module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  }, {
    tableName: 'rooms',
    underscored: true
  });
  Room.associate = (models) => (
    Room.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    })
  );
  return Room;
};
