const router = require('express').Router();
const {toggleLike,postPollChoice,postToggleRetweet,postAddReply} = require('../controllers/post.controller')

router.post('/submitPollChoice', postPollChoice)
router.post('/stats/like/toggle', toggleLike);
router.post('/toggleRetweet', postToggleRetweet);
router.post('/replies/addReply', postAddReply);


module.exports = router;

