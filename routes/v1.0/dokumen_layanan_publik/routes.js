const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/", CTRL.getDokumen);
router.post(
  "/create",
  [
    auth,
    multer.uploadDokumenLayananPublik.array("dokumen"),
    multer.handleMulterError,
  ],
  CTRL.tambahDokumen
);
router.patch(
  "/update/:id",
  [
    auth,
    multer.uploadDokumenLayananPublik.array("dokumen"),
    multer.handleMulterError,
  ],
  CTRL.ubahDokumen
);
router.delete("/delete/:id", auth, CTRL.hapusDokumen);

module.exports = router;
