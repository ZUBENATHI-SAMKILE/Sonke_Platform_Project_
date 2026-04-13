import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { authService } from '../services/api';
import styles from '../styles/App.module.css';

export default function Auth() {
  const { loginUser, registerUser } = useContext(AppContext);
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    handle: '',
    email: '',
    password: '',
    bio: '',
    stack: ''
  });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const user = await authService.login(loginData.email, loginData.password);
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      loginUser(user);
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (!registerData.name || !registerData.handle || !registerData.email || !registerData.password) {
      setRegisterError('Please fill all required fields.');
      return;
    }
    
    if (registerData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await authService.register({
        ...registerData,
        stack: registerData.stack.split(',').map(s => s.trim()).filter(Boolean)
      });
      localStorage.setItem('token', newUser.token);
      localStorage.setItem('user', JSON.stringify(newUser));
      registerUser(newUser);
    } catch (err) {
      setRegisterError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authScreen}>
      <div className={styles.authBox}>
        <div className={styles.authLogo}>
          <div className={styles.authLogoIcon}>M</div>
          <div className={styles.authLogoText}>
            Mzansi<span>Builds</span>
          </div>
        </div>

        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${tab === 'login' ? styles.active : ''}`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            className={`${styles.authTab} ${tab === 'register' ? styles.active : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {tab === 'login' && (
          <form onSubmit={handleLogin} className={styles.authForm}>
            <input
              type="email"
              placeholder="Email address"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            {loginError && <div className={styles.errorMsg}>{loginError}</div>}
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className={styles.authForm}>
            <input
              type="text"
              placeholder="Full name"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Username (e.g. kgomotso_dev)"
              value={registerData.handle}
              onChange={(e) => setRegisterData({ ...registerData, handle: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <textarea
              placeholder="Short bio — what do you build? (optional)"
              value={registerData.bio}
              onChange={(e) => setRegisterData({ ...registerData, bio: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your stack (e.g. React, Python, Node)"
              value={registerData.stack}
              onChange={(e) => setRegisterData({ ...registerData, stack: e.target.value })}
            />
            {registerError && <div className={styles.errorMsg}>{registerError}</div>}
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
