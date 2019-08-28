
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('bookings', [{
    user_id: 1,
    room_id: 1,
    departure_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 2,
    room_id: 2,
    departure_date: new Date(),
    return_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('ratings', null, {})
};
