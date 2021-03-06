const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('users', [
    {
      first_name: 'Bola',
      last_name: 'Akinjide',
      email: 'bola.akin@email.com',
      password: await bcrypt.hash('bolaji99', 10),
      gender: 'male',
      birth_date: new Date('1995-11-22'),
      preferred_language: 'en',
      preferred_currency: 'NGN',
      location: 'Nigeria',
      role: 'manager',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Helen',
      last_name: 'McMillan',
      email: 'h.milan@email.com',
      password: await bcrypt.hash('milanogelato', 10),
      gender: 'female',
      birth_date: new Date('1989-08-11'),
      preferred_language: 'en',
      preferred_currency: 'USD',
      location: 'USA',
      role: 'manager',
      created_at: new Date(),
      updated_at: new Date()
    },
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
      manager_id: 1,
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
      role: 'travel_admin',
      manager_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Peter',
      last_name: 'Doe',
      email: 'peter_koke@email.com',
      password: await bcrypt.hash('asdfghjkl', 10),
      gender: 'male',
      birth_date: new Date(),
      preferred_language: 'Latin',
      preferred_currency: 'GBP',
      location: 'Texas',
      role: 'manager',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Gowon',
      last_name: 'Nenpan',
      email: 'nenpan_gowon@email.com',
      password: await bcrypt.hash('asdfghjkl', 10),
      gender: 'female',
      birth_date: new Date(),
      preferred_language: 'Latin',
      preferred_currency: 'GBP',
      location: 'Texas',
      role: 'manager',
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
      manager_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Man',
      last_name: 'Ager',
      email: 'manager@email.com',
      password: await bcrypt.hash('password77', 10),
      gender: 'male',
      birth_date: new Date(),
      preferred_language: 'Edo',
      preferred_currency: 'GBP',
      location: 'Xander',
      role: 'manager',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Dan',
      last_name: 'Spielberg',
      email: 'dan.spielberg@email.com',
      password: await bcrypt.hash('dannylove', 10),
      gender: 'male',
      birth_date: new Date(),
      preferred_language: 'en',
      preferred_currency: 'GBP',
      location: 'Manchester',
      role: 'requester',
      manager_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      first_name: 'Jelly',
      last_name: 'Swims',
      email: 'aqua.me@email.com',
      password: await bcrypt.hash('seemeseefish', 10),
      gender: 'female',
      birth_date: new Date(),
      preferred_language: 'fr',
      preferred_currency: 'USD',
      location: 'Marseille',
      role: 'requester',
      manager_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {})
};
