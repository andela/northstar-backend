module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('trips', {
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
          key: 'id',
          as: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      category: {
        type: Sequelize.ENUM('one-way', 'round-trip', 'multi-city'),
        allowNull: false
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false
      },
      destination: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      departure_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE // return date allows null because it could be a one-way-trip
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accommodation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'id',
          as: 'accommodation_id'
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
  down: (queryInterface) => queryInterface.dropTable('trips')
  // removed the parameter "Sequelize" because it is not being used
};
