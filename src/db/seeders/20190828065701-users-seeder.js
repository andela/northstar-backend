const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('users', [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john_doe@email.com',
      password: await bcrypt.hash('qwertyuiop', 10),
      gender: 'male',
      birth_date: new Date(),
      preferred_language: 'English',
      preferred_currency: 'USD',
      location: 'Texas',
      role: 'requester',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane_doe@email.com',
      password: await bcrypt.hash('asdfghjkl', 10),
      gender: 'male',
      birth_date: new Date(),
      preferred_language: 'Latin',
      preferred_currency: 'GBP',
      location: 'Texas',
      role: 'requester',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Super',
      last_name: 'Admin',
      email: 'superadmin@barefootnomad.com',
      password: await bcrypt.hash('superadmin', 10),
      gender: 'female',
      birth_date: new Date(),
      preferred_language: 'Francais',
      preferred_currency: 'YEN',
      location: 'Jupiter',
      role: 'super_admin',
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {})
};
