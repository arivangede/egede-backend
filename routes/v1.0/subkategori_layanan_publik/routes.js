const router = require('express').Router()
const CTRL = require('./controllers')
const auth = require('../../../middlewares/verifyJwt')

router.get('/', CTRL.subKategoriLayananPublik)
router.get('/:id', auth, CTRL.subKategoriLayananPublikById)
router.post('/create', auth, CTRL.tambahSubKategoriLayananPublik)
router.patch('/update/:id', auth, CTRL.ubahSubKategoriLayananPublik)
router.delete('/delete/:id', auth, CTRL.hapusSubKategoriLayananPublik)

module.exports = router