module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('feedbacks', {
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
      feedback: {
        type: Sequelize.STRING,
        allowNull: false
      },
      facility_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'facilities',
          key: 'id',
          as: 'facility_id'
        },
        onDelete: 'CASCADE'
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
  down: (queryInterface) => queryInterface.dropTable('feedbacks')
  // removed the parameter "Sequelize" because it is not being used
};
