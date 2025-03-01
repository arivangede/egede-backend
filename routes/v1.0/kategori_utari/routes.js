const router = require('express').Router()
const CTRL = require('./controllers')
const auth = require('../../../middlewares/verifyJwt')

router.get('/', CTRL.kategoriUtari)
router.get('/:id', auth, CTRL.kategoriUtariById)
router.post('/create', auth, CTRL.tambahKategoriUtari)
router.patch('/update/:id', auth, CTRL.ubahKategoriUtari)
router.delete('/delete/:id', auth, CTRL.hapusKategoriUtari)

module.exports = router