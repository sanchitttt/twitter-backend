const router = require('express').Router();

const { getHome,
    getHomeTimeline,
    getProfile,
    patchFollow,
    patchEditProfile,
    postNewReel,
    postNewImageStory,
    postBookmarks,
    getBookmarks
} = require('../controllers/pages.controller');


router.get('/home', getHome);

router.get('/home/timeline', getHomeTimeline);

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


router.post('/bookmarks', postBookmarks)
router.get('/bookmarks', getBookmarks)


router.get('/profile', getProfile)

router.post('/home/stories/newStory', postNewImageStory);

router.patch('/profile/follow', patchFollow);

router.post('/reels/postNew', postNewReel);

router.patch('/profile/editProfile', patchEditProfile);





module.exports = router;