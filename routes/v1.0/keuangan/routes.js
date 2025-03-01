const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../middlewares/verifyJwt");

router.get("/all", CTRL.get);
router.get("/", auth, CTRL.getByGate);
router.get("/draft", auth, CTRL.getDraft);
router.get("/list", auth, CTRL.getList);
router.get("/list-count", auth, CTRL.getListCount);
router.get("/:id", auth, CTRL.getById);
router.post("/create", auth, CTRL.create);
router.patch("/create-pendapatan/:id", auth, CTRL.createPendapatan);
router.patch("/create-belanja/:id", auth, CTRL.createBelanja);
router.patch("/create-pembiayaan/:id", auth, CTRL.createPembiayaan);
router.put("/update-pendapatan/:id", auth, CTRL.updatePendapatan);
router.put("/update-belanja/:id", auth, CTRL.updateBelanja);
router.put("/update-pembiayaan/:id", auth, CTRL.updatePembiayaan);
router.put("/update-status/:id", auth, CTRL.updateStatus)
router.delete("/:id", auth, CTRL.remove);

module.exports = router;
