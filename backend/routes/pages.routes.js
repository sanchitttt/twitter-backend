const router = require('express').Router();

const { getHome, getProfile, patchFollow, patchEditProfile, postNewReel, postNewImageStory } = require('../controllers/pages.controller');


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

router.post('/home/stories/newStory', postNewImageStory);

router.patch('/profile/follow', patchFollow);

router.post('/reels/postNew', postNewReel);

router.patch('/profile/editProfile', patchEditProfile);





module.exports = router;