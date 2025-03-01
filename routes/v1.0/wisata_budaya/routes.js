const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/all", CTRL.get);
router.get("/", auth, CTRL.getByDesa);
router.post(
  "/create",
  [auth, multer.uploadWisbud.array("img"), multer.handleMulterError],
  CTRL.create
);
router.put(
  "/:id",
  [auth, multer.uploadWisbud.array("img"), multer.handleMulterError],
  CTRL.update
);
router.delete("/:id", auth, CTRL.remove);

module.exports = router;
