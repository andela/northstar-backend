import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';


/**
 * Configures passport strategies
 * @param {*} passport
 * @returns {undefined}
 */
export default (passport) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(new GoogleStrategy({
    // options
    callbackURL: '/api/v1/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET
  }, (accessToken, refreshToken, profile, done) => done(null, profile)));

  passport.use(new FacebookStrategy({
    // options
    callbackURL: '/api/v1/auth/facebook/redirect',
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['id', 'name', 'email']
  }, (accessToken, refreshToken, profile, done) => done(null, profile)));
};
