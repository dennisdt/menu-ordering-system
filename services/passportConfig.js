const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
//const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// give passportConfig.js access to the User class
  // model(arg1) means we're retreiving data
  // model(arg1, arg2) means we're loading data into db
const User = mongoose.model('users');

// take User instance created in GoogleStratey and turn into unique
  // identifier within Mongo
passport.serializeUser( (user, done) => {
  done(null, user.id);
});

// take Mongo unique identifier and turn back into a User instance
passport.deserializeUser( async (id, done) => {
  const user = await User.findById(id)
  done(null, user) });

// Google OAuth Passport Authentication *****************************
/*passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
      const isExistingUser = await User.findOne({ googleID: profile.id })
      if (isExistingUser) {
        // user exists.  do nothing
        done(null, isExistingUser);
      } else {
        // create a new Mongoose User instance and persist to mongo with .save()
        const user = await new User({ googleID: profile.id }).save();
        done(null, user);
      }
  })
);*/

// Facebook OAuth Passport Authentication ***********************
passport.use(new FacebookStrategy({
    clientID: keys.facebookAppID,
    clientSecret: keys.facebookAppSecret,
    callbackURL: "/auth/facebook/callback",
    proxy: true
  },
    async (accessToken, refreshToken, profile, done) => {
      const isExistingUser = await User.findOne({ facebookID: profile.id })
      if (isExistingUser) {
        // user exists.  do nothing
        done(null, isExistingUser);
      } else {
        // create a new Mongoose User instance and persist to mongo with .save()
        const user = await new User({facebookID: profile.id}).save();
        done(null, user);
      }
  }
));

