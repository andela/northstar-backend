module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'requests',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      notification: {
        type: Sequelize.STRING,
        allowNull: false
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      read: {
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

  down: (queryInterface) => queryInterface.dropTable('notifications')
  // removed the parameter "Sequelize" because it is not being used
};
