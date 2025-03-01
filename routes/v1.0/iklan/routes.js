const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/all", CTRL.getAll);
router.get("/", auth, CTRL.get);
router.post(
  "/create",
  [auth, multer.uploadIklan.array("img"), multer.handleMulterError],
  CTRL.create
);
router.patch(
  "/tambah",
  [auth, multer.uploadIklan.array("img"), multer.handleMulterError],
  CTRL.tambahIklan
);
router.delete("/hapus", auth, CTRL.removeIklan);
router.delete("/remove", auth, CTRL.remove);

module.exports = router;
