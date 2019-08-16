import passport from 'passport'
import passportLocal from "passport-local";

let LocalStrategy = passportLocal.Strategy;

passport.use(
    new LocalStrategy(
    )
);
