import dotenv from 'dotenv';
import EmailDraft from '../models/EmailDraft.js';
import axios from 'axios';

dotenv.config();
const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = process.env.HF_API_URL;


// Helper function to extract output after a marker
function extractGeneratedOutput(text, marker) {
  const index = text.indexOf(marker);
  if (index !== -1) {
    return text.substring(index + marker.length).trim();
  }
  return text.trim();
}

async function callMistral(prompt) {
  const headers = { 
    Authorization: `Bearer ${HF_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  const data = { 
    inputs: prompt,
    parameters: {
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.95
    }
  };
  try {
    const response = await axios.post(HF_API_URL, data, { headers });
    console.log("Response:", response.data);
    return response.data[0]?.generated_text.trim() || "No generated text returned.";
  } catch (error) {
    console.error("Error calling Mistral API", error.response?.data || error.message);
    throw error;
  }
}

export const draftEmail = async (req, res) => {
  const { input } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const prompt = `Draft a professional email using the following input. Only return the email content, and do not repeat any of these instructions.
Input: "${input}"
Email:`;
    const fullDraft = await callMistral(prompt);
    const draftOutput = extractGeneratedOutput(fullDraft, "Email:") || fullDraft;
    
    const emailRecord = new EmailDraft({
      user: userId,
      userInput: input,
      fullResponse: fullDraft,
      output: draftOutput,
      type: 'draft',
    });
    await emailRecord.save();

    res.json({ draft: draftOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating draft' });
  }
};

export const correctTone = async (req, res) => {
  const { emailContent, tone } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const prompt = `Rewrite the following email in a ${tone} tone. Only return the revised email text without repeating any instructions.
Email: "${emailContent}"
Revised Email:`;
    const fullRefined = await callMistral(prompt);
    const refinedOutput = extractGeneratedOutput(fullRefined, "Revised Email:");
    
    const emailRecord = new EmailDraft({
      user: userId,
      userInput: emailContent,
      fullResponse: fullRefined,
      output: refinedOutput,
      type: 'tone',
    });
    await emailRecord.save();
    
    res.json({ refined: refinedOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error refining tone' });
  }
};

export const summarizeEmail = async (req, res) => {
  const { emailContent } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const prompt = `Summarize the following email in a concise manner. Only return the summary.
Email: "${emailContent}"
Summary:`;
    const fullSummary = await callMistral(prompt);
    const summaryOutput = extractGeneratedOutput(fullSummary, "Summary:");
    
    const emailRecord = new EmailDraft({
      user: userId,
      userInput: emailContent,
      fullResponse: fullSummary,
      output: summaryOutput,
      type: 'summary',
    });
    await emailRecord.save();
    
    res.json({ summary: summaryOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error summarizing email' });
  }
};

export const followUpSuggestion = async (req, res) => {
  const { emailContent } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const prompt = `Based on the following email, generate a professional follow-up email. Only return the follow-up text.
Email: "${emailContent}"
Follow-up Email:`;
    const fullSuggestion = await callMistral(prompt);
    const followUpOutput = extractGeneratedOutput(fullSuggestion, "Follow-up Email:");
    
    const emailRecord = new EmailDraft({
      user: userId,
      userInput: emailContent,
      fullResponse: fullSuggestion,
      output: followUpOutput,
      type: 'followup',
    });
    await emailRecord.save();
    
    res.json({ suggestion: followUpOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error suggesting follow-up' });
  }
};

export const classifyEmail = async (req, res) => {
  const { emailContent } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const prompt = `Classify the following email into one of these categories: Professional, Personal, Promotion, Spam.
Email: "${emailContent}"
Category:`;
    const fullClassification = await callMistral(prompt);
    const classificationOutput = extractGeneratedOutput(fullClassification, "Category:");
    
    const emailRecord = new EmailDraft({
      user: userId,
      userInput: emailContent,
      fullResponse: fullClassification,
      output: classificationOutput,
      type: 'classify',
    });
    await emailRecord.save();
    
    res.json({ classification: classificationOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error classifying email' });
  }
};

export default { 
  draftEmail, 
  correctTone, 
  summarizeEmail, 
  followUpSuggestion,
  classifyEmail
};
