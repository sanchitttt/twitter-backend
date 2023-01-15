const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UserService = require('../services/user.service');


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const UserServiceInstance = new UserService();

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://twitter-backend-fcmb.onrender.com/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  const checkInDb = async () => {
    const exists = await UserServiceInstance.existsByEmail(profile.email);
    if(!exists){
      const newUser = await UserServiceInstance.create({
        id : profile.id,
        profileSrc : profile.picture,
        email : profile.email,
        accountName : profile.displayName,
        accountHandle : profile.email.split('@')[0].slice(0,15)
      })
      return done(null,newUser);
    }
    else{
      return done(null,exists);
    }
  }
  return checkInDb();
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
