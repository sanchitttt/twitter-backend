const router = require('express').Router();
const {toggleLike,postPollChoice} = require('../controllers/post.controller')

router.post('/submitPollChoice', postPollChoice)
router.post('/stats/like/toggle', toggleLike);


module.exports = router;

