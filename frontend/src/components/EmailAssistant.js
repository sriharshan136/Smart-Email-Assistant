import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './EmailAssistant.css';

const tabs = [
  { id: 'draft', label: 'Draft Email' },
  { id: 'correct', label: 'Correct Tone' },
  { id: 'summarize', label: 'Summarize Email' },
  { id: 'followup', label: 'Follow Up' },
  { id: 'classify', label: 'Classify Email' },
];

const EmailAssistant = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('draft');
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Create an axios instance that includes the Authorization header
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

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

  return (
    <motion.div
      className="email-assistant"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header>
        <h1>Smart Email Assistant</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <div className="tabs">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => {
              setActiveTab(tab.id);
              setInput('');
              setResult('');
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {(activeTab === 'draft' || activeTab === 'summarize' || activeTab === 'followup' || activeTab === 'classify') && (
            <>
              <label htmlFor="inputArea">Email Content:</label>
              <textarea
                id="inputArea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter email content or summary..."
                rows="6"
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
                placeholder="Enter original email content..."
                rows="6"
              ></textarea>
              <label htmlFor="tone">Select Tone:</label>
              <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
              </select>
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
      {result && (
        <div className="result">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Result:
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {result}
          </motion.p>
        </div>
      )}
    </motion.div>
  );
};

export default EmailAssistant;
