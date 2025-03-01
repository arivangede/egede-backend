const router = require('express').Router()
const CTRL = require('./controllers')
const middlewares = require('../../../middlewares/verifyJwt')

router.get('/', CTRL.peran)
router.post('/tambah', CTRL.tambahPeran)
router.patch('/:id', CTRL.editPeran)
router.delete('/:id', CTRL.deletePeran)

module.exports = router