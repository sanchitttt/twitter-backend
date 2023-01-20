const router = require('express').Router();
const {postNewThread, postNewTweet} = require('../controllers/post.controller');

router.post('/new/thread' , postNewThread);
router.post('/new/tweet', postNewTweet)

module.exports = router;
