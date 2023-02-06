const router = require('express').Router();

const { getHome,
    getHomeTimeline,
    getProfile,
    patchFollow,
    patchEditProfile,
    postNewReel,
    postNewImageStory,
    postBookmarks,
    getBookmarks,
    getBookmarkAlreadyExists,
    getTweetByItsId,
    getAllReels,
    postAlreadyFollows,
    postNewFollow,
    getOwnStory,
    getOtherStories,
    postNewTextStory,
    getTweetsOfAttachment,
    getTweetsByLikes,
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
router.post('/bookmark/alreadyExists', getBookmarkAlreadyExists);


router.get('/profile', getProfile)

router.post('/home/stories/newStory', postNewImageStory);
router.post('/home/stories/newTextStory' , postNewTextStory);

router.patch('/profile/follow', patchFollow);

router.post('/alreadyFollows', postAlreadyFollows)

router.post('/newFollow', postNewFollow)

router.get('/reels', getAllReels);
router.post('/reels/postNew', postNewReel);

router.get('/ownStory', getOwnStory);
router.get('/otherStories', getOtherStories);
// router.get('/profile/tweetsAndReplies', getTweetsAndReplies);
// router.get('/profile/likedTweets', getLikedTweets);
router.patch('/profile/editProfile', patchEditProfile);

router.get('/profile/getTweetsByAttachment/:accountHandle',getTweetsOfAttachment);
router.get('/profile/getTweetsByLikes/:accountHandle',getTweetsByLikes);

router.get('/home/:accountHandle/status/:tweetId', getTweetByItsId);



module.exports = router;