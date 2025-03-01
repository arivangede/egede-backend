const router = require("express").Router();
const CTRL = require("./controllers");
const authMiddlewares = require("../../../../middlewares/verifyJwt");
const multer = require("../../../../middlewares/multer");

router.get("/", CTRL.get);
router.get("/:id", authMiddlewares, CTRL.getById);
router.get("/:gid/:anggotaId", authMiddlewares, CTRL.getAnggotaById);
router.post(
  "/create",
  [authMiddlewares, multer.uploadKt.single("img"), multer.handleMulterError],
  CTRL.create
);
router.patch(
  "/:id",
  [authMiddlewares, multer.uploadKt.single("img"), multer.handleMulterError],
  CTRL.update
);
router.patch(
  "/create-anggota/:id",
  [
    authMiddlewares,
    multer.uploadAnggotaKt.single("img"),
    multer.handleMulterError,
  ],
  CTRL.createAnggota
);
router.patch(
  "/:gid/:anggotaId",
  [
    authMiddlewares,
    multer.uploadAnggotaKt.single("img"),
    multer.handleMulterError,
  ],
  CTRL.updateAnggota
);
router.delete("/:id", authMiddlewares, CTRL.remove);
router.delete("/:gid/:anggotaId", authMiddlewares, CTRL.removeAnggota);

module.exports = router;
