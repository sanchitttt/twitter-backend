const router = require('express').Router();
const {toggleLike} = require('../controllers/post.controller')

router.post('/stats/like/toggle', toggleLike);


module.exports = router;