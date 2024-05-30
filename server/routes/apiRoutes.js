const express = require('express');
const userRoutes = require('./userRoutes');
const roomRoutes = require('./roomRoutes');
const ticketRoutes = require('./ticketRoutes');

const router = express.Router();

router.use('/users', userRoutes); 
router.use('/rooms', roomRoutes); 
router.use('/tickets', ticketRoutes); 

module.exports = router;
