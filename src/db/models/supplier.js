module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'suppliers',
    underscored: true
  });
  Supplier.associate = () => {
    // associations can be defined here
  };
  return Supplier;
};
