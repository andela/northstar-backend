module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('comments', {
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
      trip_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trips',
          key: 'id',
          as: 'trip_id'
        },
        onDelete: 'CASCADE'
      },
      comment: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      replied_to: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comments',
          key: 'id',
          as: 'replied_to'
        }
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
  down: (queryInterface) => queryInterface.dropTable('comments')
  // removed the parameter "Sequelize" because it is not being used
};
