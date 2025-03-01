const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../../middlewares/verifyJwt");

router.get("/total", auth, CTRL.totalPenduduk);
router.get("/agama", auth, CTRL.agama);
router.get("/jenis-kelamin", auth, CTRL.jenisKelamin);
router.get("/pekerjaan", auth, CTRL.pekerjaan);
router.get("/suku-bangsa", auth, CTRL.sukuBangsa);
router.get("/pendidikan", auth, CTRL.pendidikan);
router.get("/status-pernikahan", auth, CTRL.statusPernikahan);
router.get("/usia", auth, CTRL.usia);

module.exports = router;
