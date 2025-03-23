import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import './Auth.css';

const Signup = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Add floating particles similar to Login
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 30,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    color: i % 3 === 0 ? '#6e8efb' : i % 3 === 1 ? '#a777e3' : '#ff7eb3',
    opacity: Math.random() * 0.07 + 0.03
  }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await axios.post('/api/auth/signup', { username, email, password });
      const pageTransition = document.createElement('div');
      pageTransition.className = 'page-transition';
      document.body.appendChild(pageTransition);
      setTimeout(() => {
        navigate('/login');
        document.body.removeChild(pageTransition);
      }, 400);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const childVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="auth-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="floating-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            background: `radial-gradient(circle at center, ${particle.color} 0%, transparent 70%)`,
            opacity: particle.opacity
          }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <div className="noise-overlay"></div>
      <div className="auth-content">
        <motion.div 
          className="auth-logo"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <div className="auth-logo-circle">
            <div className="auth-logo-inner">
              <div className="auth-logo-dot" />
            </div>
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Create Account
        </motion.h2>
        
        <motion.form onSubmit={handleSignup} variants={staggerChildren} initial="hidden" animate="visible">
          <motion.div className="input-group" variants={childVariants}>
            <label>Username</label>
            <FiUser className="input-icon" />
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Choose a username"
              required 
            />
          </motion.div>
          
          <motion.div className="input-group" variants={childVariants}>
            <label>Email</label>
            <FiMail className="input-icon" />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="your@email.com"
              required 
            />
          </motion.div>
          
          <motion.div className="input-group" variants={childVariants}>
            <label>Password</label>
            <FiLock className="input-icon" />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </motion.div>
          
          <AnimatePresence>
            {error && (
              <motion.p 
                className="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          
          <motion.button 
            type="submit"
            disabled={isLoading}
            variants={childVariants}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                Creating account...
              </motion.span>
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                Sign Up <FiUserPlus className="button-icon" style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              </motion.span>
            )}
          </motion.button>
        </motion.form>
        
        <motion.p className="link-text" variants={childVariants} initial="hidden" animate="visible">
          Already have an account?
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/login">Login</Link>
          </motion.span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Signup;
