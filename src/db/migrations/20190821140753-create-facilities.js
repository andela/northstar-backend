module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('facilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      number_of_rooms: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      description: {
        type: Sequelize.STRING
      },
      available_space: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      checked_in_users: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
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
  down: (queryInterface) => queryInterface.dropTable('facilities')
  // the parameter "Sequelize" was commented out because it is not in use
};
