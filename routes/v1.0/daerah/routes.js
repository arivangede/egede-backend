const router = require("express").Router();
const CTRL = require("./controllers");

router.get("/", CTRL.get);
router.get("/nama-desa/:gate", CTRL.getDesaNameByGate);
router.get("/desa-list", CTRL.getNamaDesaList);
router.post("/create", CTRL.create);
router.patch("/:id", CTRL.update);
router.delete("/:id", CTRL.remove);

module.exports = router;
