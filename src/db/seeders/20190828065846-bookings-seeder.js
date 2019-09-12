module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('bookings', [{
    user_id: 1,
    room_id: 1,
    departure_date: new Date(),
    return_date: new Date(new Date().getTime() + 14 * 24 * 3600000),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 2,
    room_id: 2,
    departure_date: new Date(new Date().getTime() + 7 * 24 * 3600000),
    return_date: new Date(new Date().getTime() + 24 * 24 * 3600000),
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('ratings', null, {})
};
