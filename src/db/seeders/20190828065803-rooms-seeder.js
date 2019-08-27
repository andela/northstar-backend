module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('rooms', [{
    name: 'Presidential',
    type: 'presidential',
    price: 123456.98,
    facility_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Royale',
    type: 'royale',
    price: 535272.91,
    facility_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('rooms', null, {})
};
