module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('requests', [
      {
        user_id: 2,
        category: 'one-way',
        origin: 'Paris',
        destination: ['Lagos'],
        departure_date: new Date(),
        // return_date: new Date(),
        reason: 'I am tired of this office',
        booking_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 3,
        category: 'round-trip',
        origin: 'Hamburg',
        destination: ['Tokyo'],
        departure_date: new Date(),
        return_date: new Date(),
        reason: 'My wife just was just delivered of a baby and I need to be with her.',
        booking_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        category: 'multi-city',
        origin: 'Munich',
        destination: ['Rome', 'Serbia & Montenegro', 'Madagascar'],
        departure_date: new Date(),
        return_date: new Date(),
        reason: 'I want to see the world before I die.',
        booking_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});

    return queryInterface.bulkInsert('comments', [{
      user_id: 1,
      request_id: 1,
      comment: 'You are going nowhere',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: 2,
      request_id: 1,
      comment: 'Yes, you just stay there',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface) => queryInterface.bulkDelete('requests', null, {})
};
