const router = require("express").Router();
const CTRL = require("./controllers");

router.get("/", CTRL.get);
router.put("/:id", CTRL.update);
router.delete("/:id", CTRL.remove);

module.exports = router;
