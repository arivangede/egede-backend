const router = require("express").Router();
const CTRL = require("./controllers");
const multer = require("../../../middlewares/multer");
const auth = require("../../../middlewares/verifyJwt");

router.get("/all", CTRL.getAll);
router.get("/", auth, CTRL.getByDesa);
router.get("/total", auth, CTRL.getTotalEnewsByDesa);
router.get("/:id", CTRL.getById);
router.post(
  "/create-berita",
  [auth, multer.uploadBerita.array("file"), multer.handleMulterError],
  CTRL.createBerita
);
router.post(
  "/create-pengumuman",
  [auth, multer.uploadPengumuman.array("file"), multer.handleMulterError],
  CTRL.createPengumuman
);
router.put(
  "/edit-berita/:id",
  [multer.uploadBerita.array("file"), multer.handleMulterError],
  CTRL.edit
);
router.put(
  "/edit-pengumuman/:id",
  [multer.uploadPengumuman.array("file"), multer.handleMulterError],
  CTRL.edit
);
router.delete("/:id", CTRL.remove);
router.delete("/file/:id", CTRL.editEnewsFile);

module.exports = router;
