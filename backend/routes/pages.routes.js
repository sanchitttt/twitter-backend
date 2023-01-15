const router = require('express').Router();

const {getHome,getProfile} = require('../controllers/pages.controller');


router.get('/home', getHome);

router.get('/explore', (req, res) => {
    res.status(200).end();
})

router.get('/lists', (req, res) => {
    res.status(200).end();
})


router.get('/notifications', (req, res) => {
    res.status(200).end();
})

router.get('/messages', (req, res) => {
    res.status(200).end();
})

router.get('/bookmarks', (req, res) => {
    res.status(200).end();
})

router.get('/profile', getProfile)



module.exports = router;