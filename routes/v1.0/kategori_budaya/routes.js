const router = require('express').Router()
const CTRL = require('./controllers')

router.get('/', CTRL.kategoriBudaya)
router.post('/create', CTRL.tambahKategoriBudaya)
router.patch('/update/:id', CTRL.ubahKategoriBudaya)
router.delete('/delete/:id', CTRL.hapusKategoriBudaya)

module.exports = router