import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './EmailAssistant.css';

const tabs = [
  { id: 'draft', label: 'Draft Email', icon: 'edit' },
  { id: 'correct', label: 'Correct Tone', icon: 'refresh' },
  { id: 'summarize', label: 'Summarize Email', icon: 'file-text' },
  { id: 'followup', label: 'Follow Up', icon: 'mail' },
  { id: 'classify', label: 'Classify Email', icon: 'tag' },
];

const EmailAssistant = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);
  const navigate = useNavigate();

  // Create an axios instance that includes the Authorization header
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Scroll to result when it's generated
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);
    let url = '';
    let payload = {};
    switch(activeTab) {
      case 'draft':
        url = '/api/emails/draft';
        payload = { input };
        break;
      case 'correct':
        url = '/api/emails/correct-tone';
        payload = { emailContent: input, tone };
        break;
      case 'summarize':
        url = '/api/emails/summarize';
        payload = { emailContent: input };
        break;
      case 'followup':
        url = '/api/emails/followup';
        payload = { emailContent: input };
        break;
      case 'classify':
        url = '/api/emails/classify';
        payload = { emailContent: input };
        break;
      default:
        break;
    }

    try {
      const response = await axiosInstance.post(url, payload);
      if(activeTab === 'draft') setResult(response.data.draft);
      if(activeTab === 'correct') setResult(response.data.refined);
      if(activeTab === 'summarize') setResult(response.data.summary);
      if(activeTab === 'followup') setResult(response.data.suggestion);
      if(activeTab === 'classify') setResult(response.data.classification);
    } catch(err) {
      console.error(err);
      setResult('Error occurred while processing your request.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const getTabDescription = () => {
    switch(activeTab) {
      case 'draft':
        return "Create professional emails from basic instructions";
      case 'correct':
        return "Adjust the tone of your emails to match your intended audience";
      case 'summarize':
        return "Convert long email threads into concise summaries";
      case 'followup':
        return "Generate effective follow-up messages based on previous communications";
      case 'classify':
        return "Automatically categorize emails by intent, priority, and required action";
      default:
        return "";
    }
  };

  // Icon component to replace emojis
  const Icon = ({ name }) => {
    switch(name) {
      case 'edit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        );
      case 'refresh':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
          </svg>
        );
      case 'file-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        );
      case 'tag':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        );
      case 'logout':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        );
      case 'arrow-right':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        );
      case 'copy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo-container">
          <motion.div 
            className="logo"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            EA
          </motion.div>
          <h1>Email Assistant</h1>
        </div>
        <nav className="nav-tabs">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => {
                setActiveTab(tab.id);
                setInput('');
                setResult('');
              }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon"><Icon name={tab.icon} /></span>
              <span className="tab-label">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon"><Icon name="logout" /></span>
          <span>Logout</span>
        </button>
      </div>
      <main className="main-content">
        <header className="content-header">
          <div>
            <h2>{tabs.find(tab => tab.id === activeTab)?.label}</h2>
            <p className="tab-description">{getTabDescription()}</p>
          </div>
          <div className="header-decoration"></div>
        </header>
        <div className="workspace">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {(activeTab === 'draft' || activeTab === 'summarize' || activeTab === 'followup' || activeTab === 'classify') && (
                <>
                  <label htmlFor="inputArea">Email Content:</label>
                  <textarea
                    id="inputArea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      activeTab === 'draft' 
                        ? "Enter what you want to say (e.g., 'Schedule a meeting with the marketing team for next Tuesday')"
                        : "Paste your email content here..."
                    }
                    rows="10"
                  ></textarea>
                </>
              )}
              {activeTab === 'correct' && (
                <>
                  <label htmlFor="inputArea">Original Email Content:</label>
                  <textarea
                    id="inputArea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your email content here..."
                    rows="10"
                  ></textarea>
                  <div className="tone-selector">
                    <label htmlFor="tone">Select Tone:</label>
                    <div className="tone-options">
                      <button 
                        type="button"
                        className={tone === 'professional' ? 'selected' : ''}
                        onClick={() => setTone('professional')}
                      >
                        Professional
                      </button>
                      <button 
                        type="button"
                        className={tone === 'casual' ? 'selected' : ''}
                        onClick={() => setTone('casual')}
                      >
                        Casual
                      </button>
                      <button 
                        type="button"
                        className={tone === 'friendly' ? 'selected' : ''}
                        onClick={() => setTone('friendly')}
                      >
                        Friendly
                      </button>
                    </div>
                  </div>
                </>
              )}
              <motion.button 
                type="submit" 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="loader">
                    <span className="loader-text">Processing</span>
                    <span className="dots"><span>.</span><span>.</span><span>.</span></span>
                  </span>
                ) : (
                  <>Process<span className="arrow"><Icon name="arrow-right" /></span></>
                )}
              </motion.button>
            </form>
          </div>
          {result && (
            <motion.div 
              className="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              ref={resultRef}
            >
              <div className="result-header">
                <h3>Result</h3>
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert('Copied to clipboard!');
                  }}
                >
                  <Icon name="copy" /> Copy
                </button>
              </div>
              <div className="result-content">
                <p>{result}</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmailAssistant;