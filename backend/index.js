//Packages
require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
// const session = require('express-session');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./middlewares/auth');

//Enviorment variables
const DB_URI = process.env.MONGODB_URI;
const SESSION_KEY = process.env.SESSION_KEY;
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

//Imports
const authRoutes = require('./routes/auth.routes');
const pageRoutes = require('./routes/pages.routes');
const loggedOutRoutes = require('./routes/loggedOut.routes')
const cookiesRoutes = require('./routes/cookies.routes');
const postRoutes = require('./routes/post.routes');
const verifyAuth = require('./middlewares/verifyAuth');


//database connection
mongoose.set('strictQuery',false);
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Successfully connected to database...'))
    .catch((err) => console.log(`Couldn't connect to the database!`, err));



// global middlewares
app.use(express.json());
app.use(
    cors(
        {
            origin: "http://localhost:3000",
            credentials: true,
        }
    )
);

app.use(cookieSession({
    name: 'session',
    keys: [SESSION_KEY]
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(SESSION_KEY))


// routes
app.use("/auth", authRoutes);
app.use("/pages", verifyAuth, pageRoutes);
app.use("/loggedOut", loggedOutRoutes)
app.use("/cookies", cookiesRoutes);
app.use("/tweet", verifyAuth, postRoutes);



app.listen(PORT, () => console.log(`Listening on PORT ${PORT}...`));