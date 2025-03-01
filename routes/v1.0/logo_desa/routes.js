const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/", CTRL.logoDesa);
router.get("/by-id/:id", auth, CTRL.logoDesaById);
router.get("/by-gate", auth, CTRL.logoDesaByGate);
router.post(
  "/create",
  [auth, multer.uploadLogoDesa.single("logo"), multer.handleMulterError],
  CTRL.tambahLogoDesa
);
router.patch(
  "/update/:id",
  [auth, multer.uploadLogoDesa.single("logo"), multer.handleMulterError],
  CTRL.ubahLogoDesa
);
router.delete("/delete/:id", auth, CTRL.hapusLogoDesa);

module.exports = router;
