module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('facilities', [{
    name: 'Hotel Kentucy',
    address: '21 El Nino Road',
    number_of_rooms: 22,
    description: 'The El Nino facility',
    available_space: 22,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'Hotel Portugal',
    address: '22 Portugal Road',
    number_of_rooms: 100,
    description: 'The Hotel Portugal facility',
    available_space: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'Hotel Transylvania',
    address: '52B Wolf Road',
    number_of_rooms: 500,
    description: 'The Hotel Transylvania facility',
    available_space: 500,
    checked_in_users: [1, 3],
    created_at: new Date(),
    updated_at: new Date(),
  }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('facilities', null, {})
};
