const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.post('/create', auth, CTRL.tambahPerangkatPengguna)

module.exports = router;
