const router = require("express").Router();
const CTRL = require("./controllers");
const authMiddlewares = require("../../../../middlewares/verifyJwt");
const multer = require("../../../../middlewares/multer");

router.get("/", CTRL.wilayahDesa);
router.get("/:id", authMiddlewares, CTRL.wilayahDesaById);
router.post(
  "/create-wilayah",
  [
    authMiddlewares,
    multer.uploadWilayahDesa.single("img"),
    multer.handleMulterError,
  ],
  CTRL.createWilayah
);
router.patch("/create-tabel/:id", authMiddlewares, CTRL.createTabel);
router.patch(
  "/:id",
  [authMiddlewares, multer.uploadWilayahDesa.single("img")],
  CTRL.update
);
router.delete("/:id", authMiddlewares, CTRL.remove);

module.exports = router;
