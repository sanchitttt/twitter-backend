const router = require('express').Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

router.get('/login/success', (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.status(200).json({
            "message": "Successfully logged in"
        })
    }
    else {
        res.status(403).json({ "message": "Unauthorized access" })
    }
})



router.post('/logout', (req, res) => {
    delete req.user;
    req.logout();
    req.session = null;
    res.clearCookie('session');
    res.end();
});

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        "message": "Log in failure"
    })
})

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000/login/success',
        failureRedirect: '/login/failed',
    })
)



module.exports = router;