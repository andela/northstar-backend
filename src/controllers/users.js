import bcrypt from 'bcrypt';
import models from '../db/models';
import auth from '../middlewares/auth';

/**
 * This class creates the user controller
 */
export default class UserController {
/**
 * @param {object} req The user's signup details
 * @param {object} res The user's details returned after signup
 * @returns {object} A signed up user
 */
  static async signup(req, res) {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const user = await models.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash,
        gender: req.body.gender,
        birth_date: req.body.birth_date,
        preferred_language: req.body.preferred_language,
        preferred_currency: req.body.preferred_currency,
        location: req.body.location
      });

      const userToken = auth.generateToken(user);
      return res.status(201).json({
        status: 'success',
        data: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          birth_date: user.birth_date,
          preferred_language: user.preferred_language,
          preferred_currency: user.preferred_currency,
          location: user.location,
          isVerified: user.isVerified,
          token: userToken
        }
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Could not signup user',
        });
    }
  }
}
