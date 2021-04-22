const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes')
const router = require('express').Router();
router.use('/users', userRoutes)
router.use('/thoughts', thoughtRoutes)
module.exports = router
