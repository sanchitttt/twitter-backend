const router = require('express').Router();
const {getProfileByAccountHandle} = require('../controllers/noAuth.controller');

router.get('/profile/:accountHandle', getProfileByAccountHandle)

module.exports = router;