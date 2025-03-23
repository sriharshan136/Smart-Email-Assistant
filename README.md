# Smart Email Assistant

A full-stack web application that leverages AI to help users draft, refine, summarize, and classify emails. The application supports user authentication (signup and login) and features a modern, animated, dark-themed UI built with React, Framer Motion, and custom CSS.

## Key Features

- **Email Drafting Suggestions:**  
  Generate professional email drafts based on short user input using Hugging Face's Mistral LLM.

- **Tone & Grammar Correction:**  
  Refine email content to match a desired tone (e.g., professional, casual, friendly).

- **Email Summarization:**  
  Extract key points from lengthy emails for quick understanding.

- **Follow-Up Suggestions:**  
  Generate follow-up email content based on the context of a previous email.

- **Email Classification:**  
  Automatically classify emails into categories such as Professional, Personal, Promotion, or Spam.

- **User Authentication:**  
  Secure signup and login functionality with JWT-based authentication, allowing multiple users to store and manage their email data separately.

- **Modern UI with Animations:**  
  A sleek, dark-themed interface with smooth animations, dynamic particles, and transition effects powered by Framer Motion.

## Tech Stack

- **Frontend:**

  - React
  - React Router
  - Axios
  - Framer Motion
  - React Icons

- **Backend:**

  - Node.js
  - Express
  - MongoDB (via MongoDB Atlas) with Mongoose
  - JWT for authentication
  - Integration with Hugging Face's Inference API (Mistral LLM)

- **Other Tools:**
  - dotenv for environment variables
  - bcrypt for password hashing

## Directory Structure

```plaintext
smart_email_assistant/
├── backend/
│   ├── controllers/
│   │   └── emailController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── EmailDraft.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── emailRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.css
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── EmailAssistant.js
│   │   │   └── PageTransition.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── .env
```

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/yourusername/smart_email_assistant.git
cd smart_email_assistant
```

2. Backend Setup:

- Navigate to the backend folder:

```bash
cd backend
```

- Install dependencies:

```bash
npm install
```

3. Frontend Setup:

- Open a new terminal, navigate to the frontend folder:

```bash
cd frontend
```

- Install dependencies:

```bash
npm install
```

## Environment Variables

Create a .env file in the backend folder with the following variables (update values as needed):

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster1.meeij.mongodb.net/?appName=Cluster1
HF_API_TOKEN=your_huggingface_api_token
HF_API_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407
JWT_SECRET=mysecretkey
```

Note: For production, use secure and unique values and store secrets as environment variables.

## Running the Application

1. Start the Backend Server:

- From the backend folder, run:

```bash
node server.js
```

- The backend will connect to MongoDB Atlas and listen on port 5000 (or as specified in your environment).

2. Start the Frontend Application:

- From the frontend folder, run:

```bash
npm start
```

- The React application will start on http://localhost:3000 and proxy API requests to the backend.

## Usage

### Authentication:

- Users can sign up and log in. A JWT token is stored in localStorage upon successful login and is used for authenticated API requests.

### Email Assistant:

- Once logged in, users can navigate through different tabs to generate email drafts, correct tone, summarize emails, suggest follow-ups, and classify emails. Each operation sends requests to the backend, which integrates with Hugging Face's Mistral LLM for AI-generated responses.

### Data Storage:

- All generated email details (user input, full API response, cleaned output) are stored in MongoDB, tied to each authenticated user.

## Contributing

Contributions, issues, and feature requests are welcome!

## License

Distributed under the MIT License. See LICENSE for more information.
