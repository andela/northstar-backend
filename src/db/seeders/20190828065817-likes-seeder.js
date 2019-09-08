module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('likes', [{
    facility_id: 1,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    facility_id: 2,
    user_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    facility_id: 2,
    user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('likes', null, {})
};
