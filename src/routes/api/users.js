import Users from '../../controllers/users';

export default (server) => {
  /* Users Routes Here */
  server.post('/api/v1/auth/signup', Users.signup);
};
