
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('notifications', [{
    request_id: 1,
    subject: 'About your booking',
    notification: 'See me in my office',
    receiver_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    request_id: 2,
    subject: 'Is this a joke?',
    notification: 'You just returned from Paris yesterday.',
    receiver_id: 2,
    created_at: new Date(),
    updated_at: new Date()
  }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('ratings', null, {})
};
