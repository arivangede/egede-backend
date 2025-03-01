const router = require("express").Router();
const CTRL = require("./controllers");
const authMiddleware = require("../../../../middlewares/verifyJwt");
const multer = require("../../../../middlewares/multer");

router.get("/", authMiddleware, CTRL.getAll);
router.get("/:id", authMiddleware, CTRL.getById);
router.post(
  "/create",
  [
    authMiddleware,
    multer.uploadSejarahDesa.single("img"),
    multer.handleMulterError,
  ],
  CTRL.create
);
router.patch(
  "/:id",
  [
    authMiddleware,
    multer.uploadSejarahDesa.single("img"),
    multer.handleMulterError,
  ],
  CTRL.update
);
router.delete("/:id", authMiddleware, CTRL.remove);

module.exports = router;
