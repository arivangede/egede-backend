const router = require("express").Router();
const CTRL = require("./controllers");
const middlewares = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/", CTRL.kontenWisata)
router.get("/by-gate", middlewares, CTRL.kontenWisataByGate)
router.get("/by-desa", middlewares, CTRL.kontenWisataByDesa)
router.get("/filter", middlewares, CTRL.filter)
router.get("/:id", middlewares, CTRL.kontenWisataById)
router.post("/create", [middlewares, multer.uploadKontenWisata.array("img")], CTRL.tambahKontenWisata)
router.patch("/update/:id", [middlewares, multer.uploadKontenWisata.array("img")], CTRL.ubahKontenWisata)
router.delete("/hapus/:id", middlewares, CTRL.hapusKontenWisata)

module.exports = router;
