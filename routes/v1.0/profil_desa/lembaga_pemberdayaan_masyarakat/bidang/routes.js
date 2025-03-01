const router = require("express").Router();
const CTRL = require("./controllers");
const authMiddlewares = require("../../../../../middlewares/verifyJwt");
const multer = require("../../../../../middlewares/multer");

router.get("/:gid/:bidangId", authMiddlewares, CTRL.getBidangById);
router.get("/:gid/:bidangId/:anggotaId", authMiddlewares, CTRL.getAnggotaById);
router.put("/create-bidang/:id", authMiddlewares, CTRL.createBidang);
router.put("/:gid/:bidangId", authMiddlewares, CTRL.updateBidang);
router.patch(
  "/create-anggota/:gid/:bidangId",
  [
    authMiddlewares,
    multer.uploadAnggotaBidangLpm.single("img"),
    multer.handleMulterError,
  ],
  CTRL.createAnggotaBidang
);
router.patch(
  "/:gid/:bidangId/:anggotaId",
  [
    authMiddlewares,
    multer.uploadAnggotaBidangLpm.single("img"),
    multer.handleMulterError,
  ],
  CTRL.updateAnggotaBidang
);
router.delete("/:gid/:bidangId", authMiddlewares, CTRL.removeBidang);
router.delete(
  "/:gid/:bidangId/:anggotaId",
  authMiddlewares,
  CTRL.removeAnggotaBidang
);

module.exports = router;
