// Example: User Authentication with Firebase
// This shows how to implement sign up, sign in, and sign out

import React, { useState, useEffect } from 'react';
import { 
  signUp, 
  signIn, 
  signInWithGoogle, 
  logOut, 
  onAuthChange,
  resetPassword 
} from '../index';

function AuthExample() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await signUp(formData.email, formData.password, formData.displayName);
      setMessage({ type: 'success', text: 'Account created successfully!' });
      setFormData({ email: '', password: '', displayName: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await signIn(formData.email, formData.password);
      setMessage({ type: 'success', text: 'Signed in successfully!' });
      setFormData({ email: '', password: '', displayName: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid email or password' });
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage({ type: '', text: '' });

    try {
      await signInWithGoogle();
      setMessage({ type: 'success', text: 'Signed in with Google!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await resetPassword(formData.email);
      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Check your inbox.' 
      });
      setFormData({ email: '', password: '', displayName: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      setMessage({ type: 'success', text: 'Signed out successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-profile">
          <h2>Welcome, {user.displayName || user.email}!</h2>
          <p>Email: {user.email}</p>
          <p>User ID: {user.uid}</p>
          <button onClick={handleLogOut} className="logout-btn">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button 
          className={mode === 'signin' ? 'active' : ''}
          onClick={() => setMode('signin')}
        >
          Sign In
        </button>
        <button 
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
        <button 
          className={mode === 'reset' ? 'active' : ''}
          onClick={() => setMode('reset')}
        >
          Reset Password
        </button>
      </div>

      {mode === 'signup' && (
        <form onSubmit={handleSignUp} className="auth-form">
          <h2>Create Account</h2>
          
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Display Name"
            required
          />
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (min 6 characters)"
            required
            minLength="6"
          />
          
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
      )}

      {mode === 'signin' && (
        <form onSubmit={handleSignIn} className="auth-form">
          <h2>Sign In</h2>
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          
          <button type="submit" className="submit-btn">
            Sign In
          </button>

          <div className="divider">OR</div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="google-btn"
          >
            Sign in with Google
          </button>
        </form>
      )}

      {mode === 'reset' && (
        <form onSubmit={handleResetPassword} className="auth-form">
          <h2>Reset Password</h2>
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          
          <button type="submit" className="submit-btn">
            Send Reset Email
          </button>
        </form>
      )}

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default AuthExample;

