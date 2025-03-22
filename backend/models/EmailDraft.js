import mongoose from 'mongoose';

const EmailDraftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userInput: { type: String, required: true },
  fullResponse: { type: String, required: true },
  output: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['draft', 'tone', 'summary', 'followup', 'classify'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EmailDraft', EmailDraftSchema);
