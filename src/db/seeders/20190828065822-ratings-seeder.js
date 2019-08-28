
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('ratings', [{
    rating: 5,
    user_id: 1,
    facility_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    rating: 3,
    user_id: 2,
    facility_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('ratings', null, {})
};
