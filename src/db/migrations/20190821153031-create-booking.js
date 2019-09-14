module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('bookings', {
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
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      facility_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'facilities',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      departure_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATEONLY,
      },
      checked_in: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  down: (queryInterface) => queryInterface.dropTable('bookings')
  // removed the parameter "Sequelize" because it is not being used
};
