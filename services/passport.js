const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          //we already have a record with a given profile ID
          existingUser.accessToken = accessToken;
          done(null, existingUser);
        } else {
          //create a new user in database
          // added two courses to just imitate functionality
          new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            courses: [
              {
                title: 'CSCI117',
                classid: '117',
                start: {
                  dateTime: '2017-11-21T12:30:00-07:00',
                  timeZone: 'America/Los_Angeles'
                },
                end: {
                  dateTime: '2017-11-21T13:45:00-07:00',
                  timeZone: 'America/Los_Angeles'
                }
              },
              {
                title: 'CSCI119',
                classid: '119',
                start: {
                  dateTime: '2017-11-20T12:30:00-07:00',
                  timeZone: 'America/Los_Angeles'
                },
                end: {
                  dateTime: '2017-11-20T13:45:00-07:00',
                  timeZone: 'America/Los_Angeles'
                }
              }
            ]
          })
            .save()
            .then(user => {
              done(null, user);
            });
        }
      });
    }
  )
);
