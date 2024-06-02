const express = require('express');
const userRoutes = require('./userRoutes');
const roomRoutes = require('./roomRoutes');
const ticketRoutes = require('./ticketRoutes');
const voteRoutes = require('./voteRoutes');
const voteTypeRoutes = require('./voteTypeRoutes');

const router = express.Router();
const testRoutes = require('./testRoutes');

router.use('/votes', voteRoutes);
router.use('/vote-types', voteTypeRoutes);
router.use('/', testRoutes);
router.use('/users', userRoutes); 
router.use('/rooms', roomRoutes); 
router.use('/tickets', ticketRoutes); 

module.exports = router;
