module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facility_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'facilities',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    })
  ),

  down: (queryInterface) => queryInterface.dropTable('likes')
  // the parameter "Sequelize" was removed because it is not being used
};
