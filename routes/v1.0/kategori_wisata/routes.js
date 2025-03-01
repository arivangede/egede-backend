const router = require('express').Router()
const CTRL = require('./controllers')

router.get('/', CTRL.kategoriWisata)
router.post('/create', CTRL.tambahKategoriWisata)
router.patch('/update/:id', CTRL.ubahKategoriWisata)
router.delete('/delete/:id', CTRL.hapusKategoriWisata)

module.exports = router