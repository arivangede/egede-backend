const router = require("express").Router();
const CTRL = require("./controllers");
const auth = require("../../../../../middlewares/verifyJwt");

router.get("/filter-lists", auth, CTRL.getFilter);
router.get("/penduduk-list", auth, CTRL.getPenduduk);
router.get("/details/:id", auth, CTRL.getDetails);

module.exports = router;
