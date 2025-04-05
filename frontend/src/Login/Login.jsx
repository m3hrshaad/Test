import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log('Response:', response);
      const { token } = response.data;
      // console.log('Response:', response);
      // console.log('response.data:', response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('userID', response.data.userID);
      onLogin(response.data);
      navigate('/play');
    } catch (error) {
      console.log('Full Error:', error);
      if (error.response && error.response.status === 400) {
        setError('User not found. Please register first.');
      } else {
        setError(error.response?.data.message || 'Error logging in');
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={styles.input}
        />
        <div className={styles.buttonsWrapper} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
            Login
          </button>
          <button type="button" onClick={handleRegisterRedirect} className={`${styles.button} ${styles.registerButton}`}>
            Register
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;