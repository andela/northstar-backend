import passport from 'passport';
import passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
  )
);
