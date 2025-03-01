const router = require('express').Router()
const CTRL = require('./controllers')
const auth = require('../../../middlewares/verifyJwt')
const multer = require('../../../middlewares/multer')

router.get('/', CTRL.ikm)
router.get('/by-id/:id', auth, CTRL.ikmById)
router.get('/filter', auth, CTRL.filterIkm)
router.get('/tahun', auth, CTRL.tahunIkm)
router.post('/create', auth, CTRL.tambahIkm)
router.get('/cetak', auth, CTRL.cetakIkm)
router.post('/upload-excel', [auth, multer.uploadDokumenIKM.single('file')], CTRL.uploadIKMDocument)

module.exports = router