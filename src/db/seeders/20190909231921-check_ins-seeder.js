module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('check_ins', [{
    user_id: 7,
    facility_id: 1,
    duration: 12,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 7,
    facility_id: 2,
    duration: 8,
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('check_ins', null, {})
};
