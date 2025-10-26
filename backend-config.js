// Backend Fine-Tuning Configuration
// This file contains all the rules for when to ask clarifying questions

const BACKEND_CONFIG = {
  // ===========================================
  // CLARIFICATION DETECTION RULES
  // ===========================================
  
  // When to ask clarifying questions
  clarificationRules: {
    // Decision-making patterns that trigger clarification
    decisionPatterns: [
      /\bshould\s+i\b/,                    // "should I"
      /\bhelp\s+me\s+decide\b/,           // "help me decide"
      /\bwhat\s+should\s+i\b/,            // "what should I"
      /\bis\s+it\s+worth\b/,              // "is it worth"
      /\bworth\s+it\b/,                  // "worth it"
      /\bgood\s+idea\b/,                 // "good idea"
      /\bbad\s+idea\b/,                 // "bad idea"
      /\badvice\b/,                     // "advice"
      /\brecommend\b/,                  // "recommend"
      /\bsuggest\b/,                    // "suggest"
      /\bchoose\b/,                     // "choose"
      /\bdecide\b/,                     // "decide"
      /\bbetter\b/,                     // "better"
      /\bbest\b/,                       // "best"
      /\bpros\s+and\s+cons\b/,          // "pros and cons"
      /\bcompare\b/,                    // "compare"
      /\bwhich\b/,                      // "which"
      /\bwhat\s+do\s+you\s+think\b/,    // "what do you think"
      /\bopinion\b/,                    // "opinion"
      /\bthoughts\b/                    // "thoughts"
    ],
    
    // Vague question patterns that trigger clarification
    vaguePatterns: [
      /\bwhat\s+do\s+you\s+think\b/,    // "what do you think"
      /\bopinion\b/,                    // "opinion"
      /\bthoughts\b/,                  // "thoughts"
      /\bhow\s+about\b/,               // "how about"
      /\bwhat\s+about\b/,              // "what about"
      /\btell\s+me\s+about\b/,         // "tell me about"
      /\bwhat\s+if\b/,                 // "what if"
      /\bshould\s+i\s+be\b/,          // "should I be"
      /\bam\s+i\s+right\b/,           // "am I right"
      /\bis\s+this\s+normal\b/         // "is this normal"
    ],
    
    // Keywords that indicate need for clarification
    clarificationKeywords: [
      // Life decisions
      'career', 'job', 'work', 'move', 'relocate', 'city', 'location',
      'buy', 'purchase', 'invest', 'money', 'financial', 'budget',
      'relationship', 'marriage', 'divorce', 'dating', 'partner',
      'education', 'school', 'study', 'degree', 'course',
      'health', 'medical', 'doctor', 'treatment', 'therapy',
      
      // Business decisions
      'business', 'startup', 'company', 'entrepreneur', 'funding',
      'hire', 'fire', 'promotion', 'salary', 'negotiate',
      'partnership', 'contract', 'deal', 'investment',
      
      // Personal development
      'learn', 'skill', 'training', 'certification', 'development',
      'goal', 'plan', 'strategy', 'timeline', 'deadline',
      'priority', 'important', 'urgent', 'critical'
    ],
    
    // Patterns that should NOT trigger clarification (factual questions)
    skipClarificationPatterns: [
      /^what\s+is\b/,                   // "what is"
      /^how\s+to\b/,                    // "how to"
      /^define\b/,                      // "define"
      /^explain\b/,                     // "explain"
      /^tell\s+me\s+about\b/,          // "tell me about" (factual)
      /^what\s+are\b/,                  // "what are"
      /^how\s+does\b/,                  // "how does"
      /^when\s+did\b/,                  // "when did"
      /^where\s+is\b/,                  // "where is"
      /^who\s+is\b/,                    // "who is"
      /^why\s+does\b/,                  // "why does"
      /^calculate\b/,                   // "calculate"
      /^convert\b/,                     // "convert"
      /^formula\b/,                     // "formula"
      /^definition\b/,                  // "definition"
      /^meaning\b/,                     // "meaning"
      /^difference\b/,                  // "difference"
      /^similar\b/,                     // "similar"
      /^example\b/,                     // "example"
      /^list\b/,                        // "list"
      /^show\b/,                        // "show"
      /^find\b/,                        // "find"
      /^search\b/                       // "search"
    ]
  },
  
  // ===========================================
  // QUESTION GENERATION RULES
  // ===========================================
  
  // How many questions to ask (configurable)
  questionCount: {
    min: 2,           // Minimum questions to ask
    max: 4,           // Maximum questions to ask
    default: 3        // Default number of questions
  },
  
  // Question templates by category
  questionTemplates: {
    // Career/Job related questions
    career: {
      keywords: ['career', 'job', 'work', 'employment', 'profession'],
      questions: [
        "What's your current career situation and experience level?",
        "What are your main career goals and priorities?",
        "What specific challenges or opportunities are you considering?",
        "What's your timeline for this career decision?",
        "What are your main concerns about this career path?"
      ]
    },
    
    // Location/Moving related questions
    location: {
      keywords: ['move', 'relocate', 'city', 'location', 'place', 'area'],
      questions: [
        "What's your current location and where are you considering moving?",
        "What's driving your interest in relocating?",
        "What are your main priorities for the new location (job, family, lifestyle)?",
        "What's your timeline for this move?",
        "What are your main concerns about relocating?"
      ]
    },
    
    // Financial/Purchase related questions
    financial: {
      keywords: ['buy', 'purchase', 'invest', 'money', 'financial', 'budget', 'cost', 'price'],
      questions: [
        "What's your budget range for this decision?",
        "What are your main priorities and requirements?",
        "What's your timeline for making this decision?",
        "What's your risk tolerance for this investment?",
        "What are your main concerns about this purchase?"
      ]
    },
    
    // Relationship related questions
    relationship: {
      keywords: ['relationship', 'marriage', 'divorce', 'dating', 'partner', 'love'],
      questions: [
        "What's the current state of your relationship?",
        "What specific concerns or goals do you have?",
        "What's your timeline for addressing this situation?",
        "What are your main priorities in this relationship?",
        "What are your main concerns about this relationship?"
      ]
    },
    
    // Education related questions
    education: {
      keywords: ['education', 'school', 'study', 'degree', 'course', 'learning'],
      questions: [
        "What's your current educational background?",
        "What are your career goals and how does education fit in?",
        "What's your timeline and budget for this educational decision?",
        "What specific skills or knowledge are you looking to gain?",
        "What are your main concerns about this educational path?"
      ]
    },
    
    // Health related questions
    health: {
      keywords: ['health', 'medical', 'doctor', 'treatment', 'therapy', 'wellness'],
      questions: [
        "What specific health concerns or goals do you have?",
        "What's your current health situation?",
        "What's your timeline for addressing this health matter?",
        "What are your main priorities for your health?",
        "What are your main concerns about this health decision?"
      ]
    },
    
    // Business related questions
    business: {
      keywords: ['business', 'startup', 'company', 'entrepreneur', 'funding', 'hire'],
      questions: [
        "What's your current business situation and experience?",
        "What are your main business goals and priorities?",
        "What specific challenges or opportunities are you considering?",
        "What's your timeline for this business decision?",
        "What are your main concerns about this business path?"
      ]
    },
    
    // Generic questions for other topics
    generic: {
      keywords: [],
      questions: [
        "What's your current situation regarding this topic?",
        "What are your main goals and priorities?",
        "What specific challenges or opportunities are you considering?",
        "What's your timeline for this decision?",
        "What are your main concerns about this situation?"
      ]
    }
  },
  
  // ===========================================
  // ADVANCED CONFIGURATION
  // ===========================================
  
  // Confidence thresholds
  confidence: {
    // Minimum confidence to ask clarifying questions
    minConfidence: 0.6,
    
    // Maximum confidence to skip clarifying questions
    maxConfidence: 0.9,
    
    // Weight factors for different detection methods
    weights: {
      decisionPatterns: 0.4,      // Weight for decision-making patterns
      vaguePatterns: 0.3,         // Weight for vague question patterns
      keywords: 0.3              // Weight for keyword matching
    }
  },
  
  // Response customization
  responses: {
    // Message when asking for clarification
    clarificationMessage: "I'd like to understand your situation better to give you a personalized answer. Could you help me with a few questions?",
    
    // Message when skipping clarification
    directAnswerMessage: "I can provide you with a direct answer to your question.",
    
    // Message when user skips questions
    skipMessage: "I'll provide you with a general answer based on your original question.",
    
    // Message when user submits answers
    submitMessage: "Thank you for providing that context. Here's my personalized response:"
  },
  
  // Debugging and logging
  debug: {
    enabled: false,              // Enable debug logging
    logPatterns: false,         // Log which patterns matched
    logConfidence: false,        // Log confidence scores
    logQuestions: false         // Log generated questions
  }
};

module.exports = BACKEND_CONFIG;
