module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other')
    },
    birth_date: {
      type: DataTypes.DATE
    },
    preferred_language: {
      type: DataTypes.STRING
    },
    preferred_currency: {
      type: DataTypes.ENUM('NGN', 'USD', 'GBP', 'EUR', 'YEN')
    },
    location: {
      type: DataTypes.STRING
    },
    manager_id: {
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'travel_admin', 'manager', 'requester'),
      allowNull: false,
      defaultValue: 'requester'
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email_notification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    tableName: 'users',
    underscored: true
  });
  User.associate = (models) => {
    // associations can be defined here
    User.belongsTo(models.User, {
      foreignKey: 'manager_id',
      constraints: false
    });
  };
  return User;
};
