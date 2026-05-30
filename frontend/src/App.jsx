import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const savedUser = localStorage.getItem('krishi_user');
    const token = localStorage.getItem('krishi_token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user from localStorage:", e);
        localStorage.removeItem('krishi_user');
        localStorage.removeItem('krishi_token');
      }
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div style={styles.loaderContainer}>
        <div className="grow-loader" style={styles.spinner} />
        <h2>Initializing KrishiSeva...</h2>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

const styles = {
  loaderContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f6f0',
    gap: '16px',
    fontFamily: 'sans-serif'
  },
  spinner: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '5px solid #e8f5e9',
    borderTopColor: '#2e7d32',
    animation: 'spin 1s linear infinite'
  }
};
