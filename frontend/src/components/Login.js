import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import "./Auth.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Floating particles for a dynamic background
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    color: i % 3 === 0 ? "#6e8efb" : i % 3 === 1 ? "#a777e3" : "#ff7eb3",
    opacity: Math.random() * 0.07 + 0.03,
  }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      setIsAuthenticated(true);
      // Create a transition effect before navigating
      const pageTransition = document.createElement("div");
      pageTransition.className = "page-transition";
      document.body.appendChild(pageTransition);
      setTimeout(() => {
        navigate("/");
        document.body.removeChild(pageTransition);
      }, 400);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
      setIsLoading(false);
    }
  };

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.2 },
    },
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="floating-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            background: `radial-gradient(circle at center, ${particle.color} 0%, transparent 70%)`,
            opacity: particle.opacity,
          }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 180, 360] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      <div className="noise-overlay"></div>
      <div className="auth-content">
        <motion.div
          className="auth-logo"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
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
          Welcome Back
        </motion.h2>
        <motion.form
          onSubmit={handleLogin}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="input-group" variants={itemVariants}>
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
          <motion.div className="input-group" variants={itemVariants}>
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
          <motion.div className="remember-me" variants={itemVariants}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="checkmark"></span>
              <span className="label-text">Remember me</span>
            </label>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            type="submit"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Logging in...
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Login <FiArrowRight className="button-icon" />
              </motion.span>
            )}
          </motion.button>
        </motion.form>
        <motion.p
          className="link-text"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Don't have an account?
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/signup">Sign up</Link>
          </motion.span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Login;
