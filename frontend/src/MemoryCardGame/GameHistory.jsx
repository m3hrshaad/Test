import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameHistory.css';
import { useNavigate } from 'react-router-dom';

export default function GameHistory() {
    const [gameHistory, setGameHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onBackClick = () => {
      navigate(`/play`);
    }


    useEffect(() => {
      const token = localStorage.getItem('token');
      // console.log('Token:', token); 
      const userID = localStorage.getItem('userID')
      // console.log('userID:', userID); 
    
      if (!token) {
        setError('No token found, please log in');
        setLoading(false);
        return;
      }
    
      const fetchHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/memory/history/${userID}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Fix the template string
            },
          });
          
          // console.log('Response history:', response.data); 
          setGameHistory(response.data);
        } catch (err) {
          if (err.response) {
            console.error('Error response:', err.response);
            setError(`Error: ${err.response.data?.message || 'Unknown error occurred'}`);
            } else {
            //In case of another error such as disconnection from the internet
            console.error('Error message:', err.message);
            setError(`Error fetching game history: ${err.message}`);
          }
        } finally {
          setLoading(false);
        }
      };
    
      fetchHistory();
    }, []);
    
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    return (
      <div className="game-history-container">
        <button className="back-button" onClick={onBackClick}>Back</button>
        <h1>Game History</h1>
        <table className="game-history-table">
          <thead>
            <tr>
              <th>Game Date</th>
              <th>Difficulty</th>
              <th>Completed</th>
              <th>Failed</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {gameHistory && gameHistory.length > 0 ? (
              gameHistory.map((game, index) => (
                <tr key={index}>
                  <td>{new Date(game.gameDate).toLocaleString()}</td>
                  <td>{game.difficulty}</td>
                  <td>{game.completed ? 'Yes' : 'No'}</td>
                  <td>{game.failed ? 'Yes' : 'No'}</td>
                  <td>{game.timeTaken} seconds</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No game history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }