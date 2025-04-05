const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { gameDate, failed, difficulty, completed, timeTaken } = req.body;
    const userID = req.userID;


    try {
       
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });

    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

exports.getGameHistory = async (req, res) => {
    const userID = req.userID;
    console.log('Request params:', req.params);
    console.log('userID:', userID);

    try {
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const gameHistory = await Save.find({ userID }).sort({ gameDate: -1 });

        if (!gameHistory || gameHistory.length === 0) {
            return res.status(404).json({ message: 'No game history found for this user' });
        }

        res.status(200).json(gameHistory);
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ message: 'Error fetching game history', error });
    }
};
