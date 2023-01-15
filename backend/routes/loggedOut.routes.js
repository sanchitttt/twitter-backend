const router = require('express').Router();
const { postLogin, postLogin2 } = require('../controllers/pages.controller');
const verifySchema = require('../middlewares/verifySchema.middleware');
const loginBodySchema = require('../validations/loginBody.validation');

const loginSchemaValidation = verifySchema(loginBodySchema);

router.post('/login', loginSchemaValidation, postLogin);

router.post('/login/2', postLogin2)

module.exports = router;