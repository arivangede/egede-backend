const router = require("express").Router();
const CTRL = require("./controllers");
const multer = require("../../../middlewares/multer");
const authMiddlewares = require("../../../middlewares/verifyJwt");

router.get("/", CTRL.get);
router.get("/public/:id", authMiddlewares, CTRL.getUserPublicById);
router.get("/private/:id", authMiddlewares, CTRL.getUserPrivateById);
router.get("/:id", authMiddlewares, CTRL.getUserDetailsById);
router.get("/user-validity/:pengguna_id", CTRL.isUserValid);
router.post("/registrasi", CTRL.register);
router.post("/:id", CTRL.activate);
router.patch("/:id", authMiddlewares, CTRL.update);
router.put("/lupa-sandi", CTRL.forget);
router.put("/:id", CTRL.updateOtp);
router.delete("/:id", CTRL.remove);

module.exports = router;
