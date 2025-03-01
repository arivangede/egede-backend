const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get("/all", CTRL.getAll)
router.get("/by-user-login", auth, CTRL.getByUserLogin)
router.get('/count-by-status', auth, CTRL.getCountByStatus)
router.get('/filter', auth, CTRL.filter)
router.post(
  "/create",
  [auth, multer.uploadPengaduan.single("file"), multer.handleMulterError],
  CTRL.create
)
router.patch('/disetujui/:id', auth, CTRL.approve)
router.patch('/ditolak/:id', auth, CTRL.rejected)
router.patch("/alih-tugas/:pengaduan_id", auth, CTRL.switchAssignment)
router.patch('/dikerjakan/:id', [auth, multer.uploadStatusPengaduan.single("file")], CTRL.inProgress)
router.patch('/selesai/:id', auth, CTRL.finish)

module.exports = router;
