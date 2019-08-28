module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('amenities', [{
    name: 'Wifi',
    description: 'Connect to super-fast internet at 1Gbps speed.',
    facility_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Breakfast',
    description: 'We also serve breakfast in bed.',
    facility_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Swimming Pool',
    description: 'Even Michael Phelps cannot handle our world-class swimming pool.',
    facility_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('amenities', null, {})
};
