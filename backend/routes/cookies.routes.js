const router = require('express').Router();


router.get('/destroy/login' , (req,res) => {
    res.clearCookie('login');
    res.end();
})

module.exports = router;