module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('rooms', {
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
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      facility_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('rooms')
  // removed the parameter "Sequelize" because it is not being used
};
