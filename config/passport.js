const GoogleStrategy = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../models/user_model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log("serializing user now");
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  console.log("deserializing user now");
  User.findOne({ _id }).then((user) => {
    console.log("found user");
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback 登入完成後將會顯示的畫面

      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("User already exist");
          done(null, foundUser);
        } else {
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user created");
              done(null, newUser);
            });
        }
      });
    }
  )
);

//local login
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username })
      .then(async (user) => {
        if (!user) {
          return done(null, false);
        }
        await bcrypt.compare(password, user.password, function (error, result) {
          if (error) {
            return done(null, false);
          }
          if (!result) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
        return done(null, user);
      })
      .catch((err) => {
        return done(null, false);
      });
  })
);
