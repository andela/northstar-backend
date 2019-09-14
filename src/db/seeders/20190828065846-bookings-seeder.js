module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('bookings', [{
    user_id: 1,
    room_id: 1,
    facility_id: 1,
    departure_date: new Date(),
    return_date: new Date(new Date().getTime() + 14 * 24 * 3600000),
    checked_in: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 7,
    room_id: 1,
    facility_id: 1,
    departure_date: new Date(),
    return_date: new Date(new Date().getTime() + 14 * 24 * 3600000),
    checked_in: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 7,
    room_id: 2,
    facility_id: 2,
    checked_in: true,
    departure_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: 2,
    room_id: 2,
    facility_id: 1,
    departure_date: new Date(new Date().getTime() + 7 * 24 * 3600000),
    return_date: new Date(new Date().getTime() + 24 * 24 * 3600000),
    checked_in: false,
    created_at: new Date(),
    updated_at: new Date()
  }], {}),

  down: (queryInterface) => queryInterface.bulkDelete('ratings', null, {})
};
