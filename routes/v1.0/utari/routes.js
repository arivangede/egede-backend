const router = require("express").Router();
const CTRL = require("./controllers");
const multer = require("../../../middlewares/multer");
const auth = require("../../../middlewares/verifyJwt");

router.get('/', CTRL.utari)
router.get('/by-id/:id', auth, CTRL.utariById)
router.get('/detail/by-user', auth, CTRL.utariDetailByUser)
router.get('/detail', auth, CTRL.utariDetails)
router.get('/detail/:id', auth, CTRL.utariDetailById)
router.get('/filter', auth, CTRL.utariFilter)

// router.post('/create-datapenduduk', [auth, multer.uploadPhotoKTP.single("foto_ktp")], CTRL.utariDataPenduduk)
router.post('/create-datapenduduk', [auth, multer.uploadIjazahKk], CTRL.utariDataPenduduk);

router.patch('/update-datapenduduk/:id', [auth, multer.uploadPhotoKTP.single("foto_ktp")], CTRL.updateUtariDataPenduduk)
router.post('/create-datakeluarga', [auth, multer.uploadPhotoKK.single("foto_kk")], CTRL.utariDataKeluarga)
router.patch('/update-datakeluarga/:id', [auth, multer.uploadPhotoKK.single("foto_kk")], CTRL.updateUtariDataKeluarga)
router.post('/create-datapendidikan', [auth, multer.uploadPhotoIjazah.single("foto_ijazah")], CTRL.utariDataPendidikan)
router.patch('/update-datapendidikan/:id', [auth, multer.uploadPhotoIjazah.single("foto_ijazah")], CTRL.updateUtariDataPendidikan)
router.post('/create-fotopenduduk', [auth, multer.uploadPhotoPenduduk.single("foto_penduduk")], CTRL.utariFotoPenduduk)
router.patch('/update-fotopenduduk/:id', [auth, multer.uploadPhotoPenduduk.single("foto_penduduk")], CTRL.updateUtariFotoPenduduk)
router.patch('/dilihat/:id', auth, CTRL.dilihat)
router.patch('/status-perbaikan/:id', auth, CTRL.statusPerbaikan)
router.patch('/status-disetujui/:id', auth, CTRL.statusDiterima)
router.patch('/status-ditolak/:id', auth, CTRL.statusDitolak)

module.exports = router;
