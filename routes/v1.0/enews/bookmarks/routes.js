const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../../middlewares/verifyJwt");

router.get("/all", CTRL.get);
router.get("/", auth, CTRL.getByUser);
router.get("/isBookmarked/:enewsKode", auth, CTRL.isBookmarked);
router.post("/:id", auth, CTRL.addBookmark);
router.delete("/:id", auth, CTRL.removeBookmark);

module.exports = router;
