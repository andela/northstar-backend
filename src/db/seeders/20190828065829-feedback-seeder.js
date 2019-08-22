module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('feedbacks', [{
    user_id: 1,
    feedback: 'Very good hotel',
    facility_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 2,
    feedback: 'Very poor hotel',
    facility_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('ratings', null, {})
};
