const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../../middlewares/verifyJwt");

router.get("/all", CTRL.get);
router.get("/:enewsId", CTRL.count);
router.get("/isLiked/:enewsId", auth, CTRL.isUserLiked);
router.post("/:id", auth, CTRL.giveLike);
router.delete("/:id", auth, CTRL.removeLike);

module.exports = router;
