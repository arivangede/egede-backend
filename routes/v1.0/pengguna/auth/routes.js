const router = require('express').Router();
const CTRL = require('./controllers')

router.post('/login', CTRL.login)

module.exports = router