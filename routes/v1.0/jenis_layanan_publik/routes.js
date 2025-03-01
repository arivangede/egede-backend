const router = require('express').Router()
const CTRL = require('./controllers')
const auth = require('../../../middlewares/verifyJwt')

router.get('/', CTRL.jenisLayananPublik)
router.get('/:id', auth, CTRL.jenisLayananPublikById)
router.post('/create', auth, CTRL.tambahJenisLayananPublik)
router.patch('/update/:id', auth, CTRL.ubahJenisLayananPublik)
router.delete('/delete/:id', auth, CTRL.hapusJenisLayananPublik)

module.exports = router