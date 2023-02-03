const router = require('express').Router();
const { getAccountDetails, getSearchResults,getWhoToFollow ,getTrendingTweets} = require('../controllers/other.controller');

router.get('/getAccountDetails', getAccountDetails);
router.get('/searchBar', getSearchResults);
router.get('/whoToFollow',getWhoToFollow);
router.get('/trendingTweets', getTrendingTweets);

module.exports = router;