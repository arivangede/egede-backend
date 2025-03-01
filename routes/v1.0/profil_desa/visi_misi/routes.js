const router = require('express').Router()
const CTRL = require('./controllers')
const authMiddlewares = require('../../../../middlewares/verifyJwt')

router.get('/', CTRL.visiMisi)
router.get('/:id', authMiddlewares, CTRL.visiMisiById)
router.post('/create', authMiddlewares, CTRL.create)
router.patch('/:id', authMiddlewares, CTRL.update)
router.delete('/:id', authMiddlewares, CTRL.remove)

module.exports = router