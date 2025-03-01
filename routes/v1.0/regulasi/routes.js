const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/all", CTRL.get);
router.get("/", auth, CTRL.getByGate);
router.get("/total", auth, CTRL.getTotalsByGate);
router.get("/:id", auth, CTRL.getById);
router.post(
  "/create",
  [auth, multer.uploadRegulasi.single("dokumen"), multer.handleMulterError],
  CTRL.create
);
router.put(
  "/:id",
  [auth, multer.uploadRegulasi.single("dokumen"), multer.handleMulterError],
  CTRL.update
);
router.delete("/:id", auth, CTRL.remove);

module.exports = router;
