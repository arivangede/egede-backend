const router = require("express").Router();
const CTRL = require("./controllers");
const middlewares = require("../../../middlewares/verifyJwt");

router.get("/", CTRL.get);
router.post("/create", CTRL.create);
router.put("/:id", CTRL.update);
router.delete("/:id", CTRL.remove);

module.exports = router;
