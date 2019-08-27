module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('amenities', {
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
      description: {
        type: Sequelize.STRING
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
  down: (queryInterface) => queryInterface.dropTable('amenities')
  // removed the parameter "Sequelize" because it is not being used
};
