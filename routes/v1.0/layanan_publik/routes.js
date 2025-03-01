const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");
const multer = require("../../../middlewares/multer");

router.get('/', CTRL.layananPublik)
router.get('/by-id/:id', auth, CTRL.layananPublikById)
router.get('/detail', auth, CTRL.layananPublikDetails)
router.get('/detail/by-id/:id', auth, CTRL.layananPublikDetailById)
router.get('/detail/by-user', auth, CTRL.layananPublikDetailsByUser)
router.get('/detail/by-gate', auth, CTRL.layananPublikDetailsByGate)
router.get('/filter', auth, CTRL.filter)
router.get('/counts', auth, CTRL.countLayananPublikByStatus)
router.post('/create', [auth, multer.uploadTripleFields], CTRL.tambahLayananPublik)
router.patch('/status-ditolak/:id', auth, CTRL.statutDitolakLayananPublik)
router.patch('/status-dikerjakan/:id', auth, CTRL.statusDikerjakanLayananPublik)
router.patch('/status-selesai/:id', auth, CTRL.statusSelesaiLayananPublik)

module.exports = router;
