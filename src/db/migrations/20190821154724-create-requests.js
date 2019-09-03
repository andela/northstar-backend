module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      category: {
        type: Sequelize.ENUM('one-way', 'round-trip', 'multi-city'),
        allowNull: false
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false
      },
      destination: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      departure_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATEONLY // return date allows null because it could be a one-way-trip
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'declined', 'approved'),
        defaultValue: 'pending'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable('requests')
  // removed the parameter "Sequelize" because it is not being used
};
