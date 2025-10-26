# Unpack

A React application that helps users get better responses from LLMs by asking clarifying questions before generating answers.

## Features

- **Smart Detection**: Automatically determines if a prompt needs clarification
- **Dynamic Questions**: Generates relevant clarifying questions based on the prompt type
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Smooth Transitions**: Animated state transitions for better UX
- **API Ready**: Backend prepared for LLM API integration

## Project Structure

```
intent-clarifier/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Tailwind CSS styles
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Express backend
│   ├── server.js          # Express server with API routes
│   └── package.json
├── package.json           # Root package.json
├── env.template          # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd intent-clarifier
   ```

2. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables:**
   ```bash
   cp env.template .env
   # Edit .env with your API keys
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the React frontend (port 3000) and Express backend (port 5000).

### Individual Commands

- **Start both client and server:** `npm run dev`
- **Start only the server:** `npm run server`
- **Start only the client:** `npm run client`

## API Endpoints

The server provides the following endpoints:

- `POST /api/check-clarification` - Determines if a prompt needs clarification
- `POST /api/generate-questions` - Generates clarifying questions for a prompt
- `POST /api/generate-answer` - Generates final answer (placeholder for LLM integration)
- `GET /api/health` - Health check endpoint

## Smart Detection Logic

The app uses pattern matching to determine when clarification is needed:

### Needs Clarification:
- Decision-making queries ("should I", "help me decide")
- Advice requests ("recommend", "what should I do")
- Vague questions ("better", "best", "worth it")
- Comparison questions ("which", "compare")

### Skips Clarification:
- Factual questions ("what is", "how to", "define")
- Well-specified technical questions
- Information requests ("tell me about", "explain")

## UI States

1. **Initial State**: User enters their prompt
2. **Questions State**: User answers clarifying questions (if needed)
3. **Answer State**: Display the final response
4. **Loading State**: Show loading spinner during processing

## Customization

### Adding New Question Patterns

Edit the `generateClarifyingQuestions` function in both:
- `client/src/App.jsx` (frontend)
- `server/server.js` (backend)

### Styling

The app uses Tailwind CSS. Customize styles in:
- `client/src/index.css`
- `client/tailwind.config.js`

## Deployment

This project is ready for deployment! See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Frontend (GitHub Pages)**:
- Already configured with GitHub Actions
- Automatically deploys on push to main branch
- Available at: `https://tracyyyleung.github.io/unpack`

**Backend (Railway/Render)**:
- Configure environment variables
- Deploy with one click
- Connect to your GitHub repository

### Required Environment Variables

**Backend**:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=production
FRONTEND_URL=https://tracyyyleung.github.io/unpack
```

**Frontend**:
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Next Steps

To complete the implementation:

1. **Deploy to Production:**
   - Follow the deployment guide
   - Set up environment variables
   - Test the complete application

2. **Add LLM API Integration:**
   - Integrate with Anthropic Claude API
   - Add OpenAI as backup option
   - Implement proper error handling

3. **Enhance Question Generation:**
   - Use LLM to generate more sophisticated questions
   - Add context-aware question selection

4. **Add Features:**
   - Save conversation history
   - Export responses
   - User preferences
   - Advanced question types

## Technologies Used

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js
- **Styling**: Tailwind CSS with custom animations
- **HTTP Client**: Axios

## License

MIT License

