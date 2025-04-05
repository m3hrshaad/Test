const express = require('express');
const { verifyToken } = require('../controllers/userController');
const { saveGameData, getGameHistory } = require('../controllers/memoryController');

const router = express.Router();

// Route to save game data
router.post('/save',verifyToken, saveGameData);

// Route to fetch game history
router.get('/history/:id',verifyToken, getGameHistory);;

module.exports = router;
