const router = require("express").Router();
const CTRL = require("./controllers");
const middlewares = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/", CTRL.kontenBudaya)
router.get("/by-gate", middlewares, CTRL.kontenBudayaByGate)
router.get("/by-desa", middlewares, CTRL.kontenBudayaByDesa)
router.get("/filter", middlewares, CTRL.filter)
router.get("/:id", middlewares, CTRL.kontenBudayaById)
router.post("/create", [middlewares, multer.uploadKontenBudaya.array("img")], CTRL.tambahKontenBudaya)
router.patch("/update/:id", [middlewares, multer.uploadKontenBudaya.array("img")], CTRL.ubahKontenBudaya)
router.delete("/hapus/:id", middlewares, CTRL.hapusKontenBudaya)

module.exports = router;
