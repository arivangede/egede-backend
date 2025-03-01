const router = require('express').Router()
const CTRL = require('./controllers')
const auth = require('../../../middlewares/verifyJwt')

router.get('/', CTRL.kategoriLayananPublik)
router.get('/filter', auth, CTRL.filter)
router.get('/:id', auth, CTRL.kategoriLayananPublikById)
router.post('/create', auth, CTRL.tambahKategoriLayananPublik)
router.patch('/update/:id', auth, CTRL.ubahKategoriLayananPublik)
router.delete('/delete/:id', auth, CTRL.hapusKategoriLayananPublik)

module.exports = router