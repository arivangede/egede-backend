const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get('/', auth, CTRL.notifikasiByPengguna)
router.post('/create', auth, CTRL.tambahNotifikasi)
router.patch('/:id', auth, CTRL.updateNotifikasi)

module.exports = router;
