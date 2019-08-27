'use-strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      manager_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other')
      },
      birth_date: {
        type: Sequelize.DATE
      },
      preferred_language: {
        type: Sequelize.STRING
      },
      preferred_currency: {
        type: Sequelize.ENUM('NGN', 'USD', 'GBP', 'EUR', 'YEN'),
        defaultValue: 'NGN'
      },
      location: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('super_admin', 'travel_admin', 'manager', 'requester'),
        allowNull: false,
        defaultValue: 'requester'
      },
      email_notification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable('users')
};
