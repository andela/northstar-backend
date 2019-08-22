module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('likes', [{
    facility_id: 1,
    user_id: 1,
  },
  {
    facility_id: 2,
    user_id: 2
  },
  {
    facility_id: 2,
    user_id: 1
  }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('likes', null, {})
};
