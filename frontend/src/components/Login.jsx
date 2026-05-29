import React, { useState } from 'react';
import { Sprout, Lock, Mail, ChevronRight, AlertCircle, HelpCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        localStorage.setItem('krishi_token', data.token);
        localStorage.setItem('krishi_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to backend server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail('gmaildemo@gmail.com');
    setPassword('demo@1234');
    setError('');
  };

  return (
    <div style={styles.container}>
      {/* Background decoration */}
      <div style={styles.bgOverlay} />
      
      <div style={styles.loginCard} className="glass-panel animate-fade-in">
        <div style={styles.logoHeader}>
          <div style={styles.iconCircle}>
            <Sprout size={32} color="#ffffff" />
          </div>
          <h1 style={styles.title}>कृषिSeva</h1>
          <p style={styles.subtitle}>Empowering Indian Farmers with Smart AI Insights</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={18} color="#d84315" />
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Sign In to Farm Portal'}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        <div style={styles.demoBadge} onClick={autofillDemo}>
          <div style={styles.demoBadgeHeader}>
            <HelpCircle size={16} color="#f57c00" />
            <span style={styles.demoBadgeTitle}>Click here to Autofill Demo Credentials</span>
          </div>
          <p style={styles.demoBadgeText}>
            <strong>Email:</strong> gmaildemo@gmail.com <br />
            <strong>Password:</strong> demo@1234
          </p>
        </div>
        
        <div style={styles.footer}>
          <p>Made with ❤️ for Indian Agriculture</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    background: 'linear-gradient(rgba(46, 125, 52, 0.08), rgba(245, 124, 0, 0.08)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at center, rgba(33, 47, 41, 0.45) 0%, rgba(18, 25, 22, 0.85) 100%)',
    zIndex: 1,
  },
  loginCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px 32px',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
  },
  logoHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.35)',
    marginBottom: '8px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1b5e20',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#556657',
    fontWeight: '500',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fbe9e7',
    border: '1.5px solid #ffccbc',
    borderRadius: '10px',
    padding: '12px',
  },
  errorText: {
    color: '#c62828',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2e3d30',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#6d8c70',
    pointerEvents: 'none',
  },
  demoBadge: {
    background: '#fff8e1',
    border: '1.5px dashed #ffe082',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  demoBadgeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  demoBadgeTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#e65100',
  },
  demoBadgeText: {
    fontSize: '0.82rem',
    color: '#5d4037',
    lineHeight: '1.4',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#6d8c70',
    fontWeight: '500',
    marginTop: '8px',
  },
};
