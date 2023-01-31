const router = require('express').Router();
const { getAccountDetails, getSearchResults } = require('../controllers/other.controller');

router.get('/getAccountDetails', getAccountDetails);
router.get('/searchBar', getSearchResults);

module.exports = router;