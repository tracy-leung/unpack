const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
// Load environment variables
dotenv.config();

// Backend configuration (embedded for reliability)
console.log('🚀 Loading server with embedded config...');
const BACKEND_CONFIG = {
  clarificationRules: {
    decisionPatterns: [
      /\bshould\s+i\b/, /\bhelp\s+me\s+decide\b/, /\bwhat\s+should\s+i\b/,
      /\bis\s+it\s+worth\b/, /\bworth\s+it\b/, /\bgood\s+idea\b/,
      /\bbad\s+idea\b/, /\badvice\b/, /\brecommend\b/, /\bsuggest\b/,
      /\bchoose\b/, /\bdecide\b/, /\bbetter\b/, /\bbest\b/,
      /\bpros\s+and\s+cons\b/, /\bcompare\b/, /\bwhich\b/,
      /\bwhat\s+do\s+you\s+think\b/, /\bopinion\b/, /\bthoughts\b/,
      // Personal preference and subjective questions
      /\bwhat.*best.*for\s+me\b/, /\bwhat.*good.*for\s+me\b/, /\bwhat.*right.*for\s+me\b/,
      /\bwhat.*suitable.*for\s+me\b/, /\bwhat.*perfect.*for\s+me\b/,
      /\bwhat.*recommend.*for\s+me\b/, /\bwhat.*suggest.*for\s+me\b/,
      // "What's the best..." patterns
      /\bwhat.*best\b/, /\bwhat.*good\b/, /\bwhat.*great\b/, /\bwhat.*perfect\b/,
      /\bwhat.*ideal\b/, /\bwhat.*right\b/, /\bwhat.*suitable\b/,
      // Specific "what's the best" patterns
      /\bwhat.*the\s+best\b/, /\bwhat.*a\s+good\b/, /\bwhat.*a\s+great\b/,
      /\bwhat.*some\s+good\b/, /\bwhat.*some\s+great\b/, /\bwhat.*some\s+best\b/,
      // Personal experience and preference questions
      /\bwhat.*like\b/, /\bwhat.*enjoy\b/, /\bwhat.*prefer\b/, /\bwhat.*love\b/,
      /\bwhat.*hate\b/, /\bwhat.*dislike\b/, /\bwhat.*avoid\b/,
      // "How do I..." personal advice
      /\bhow\s+do\s+i\s+(choose|pick|select|find|get|learn|start|begin)\b/,
      // "What would you..." advice seeking
      /\bwhat\s+would\s+you\b/, /\bwhat\s+would\s+i\b/, /\bwhat\s+would\s+be\b/
    ],
    vaguePatterns: [
      /\bwhat\s+do\s+you\s+think\b/, /\bopinion\b/, /\bthoughts\b/,
      /\bhow\s+about\b/, /\bwhat\s+about\b/, /\btell\s+me\s+about\b/,
      /\bwhat\s+if\b/, /\bshould\s+i\s+be\b/, /\bam\s+i\s+right\b/,
      /\bis\s+this\s+normal\b/,
      // Personal and subjective questions
      /\bwhat.*my\b/, /\bwhat.*i\b/, /\bhow.*i\b/, /\bwhy.*i\b/,
      /\bwhat.*personal\b/, /\bwhat.*individual\b/, /\bwhat.*specific\b/,
      // Experience and preference seeking
      /\bwhat.*experience\b/, /\bwhat.*tried\b/, /\bwhat.*worked\b/,
      /\bwhat.*failed\b/, /\bwhat.*success\b/, /\bwhat.*helped\b/,
      // General advice and guidance
      /\bwhat.*guidance\b/, /\bwhat.*direction\b/, /\bwhat.*path\b/,
      /\bwhat.*approach\b/, /\bwhat.*strategy\b/, /\bwhat.*method\b/
    ],
    clarificationKeywords: [
      'career', 'job', 'work', 'move', 'relocate', 'city', 'location',
      'buy', 'purchase', 'invest', 'money', 'financial', 'budget',
      'relationship', 'marriage', 'divorce', 'dating', 'partner',
      'education', 'school', 'study', 'degree', 'course',
      'health', 'medical', 'doctor', 'treatment', 'therapy',
      'business', 'startup', 'company', 'entrepreneur', 'funding',
      // Subjective and personal preference keywords
      'book', 'books', 'movie', 'movies', 'music', 'song', 'songs',
      'restaurant', 'food', 'recipe', 'cook', 'cooking',
      'hobby', 'hobbies', 'activity', 'activities', 'sport', 'sports',
      'game', 'games', 'app', 'apps', 'software', 'tool', 'tools',
      'skill', 'skills', 'learn', 'learning', 'practice', 'practicing',
      'style', 'fashion', 'clothes', 'clothing', 'outfit', 'outfits',
      'travel', 'trip', 'vacation', 'destination', 'place', 'places',
      'gift', 'gifts', 'present', 'presents', 'surprise', 'surprises',
      'goal', 'goals', 'dream', 'dreams', 'wish', 'wishes', 'hope', 'hopes'
    ],
    skipClarificationPatterns: [
      /^what\s+is\b/, /^how\s+to\b/, /^define\b/, /^explain\b/,
      /^tell\s+me\s+about\b/, /^what\s+are\b/, /^how\s+does\b/,
      /^when\s+did\b/, /^where\s+is\b/, /^who\s+is\b/, /^why\s+does\b/,
      /^calculate\b/, /^convert\b/, /^formula\b/, /^definition\b/,
      /^meaning\b/, /^difference\b/, /^similar\b/, /^example\b/,
      /^list\b/, /^show\b/, /^find\b/, /^search\b/
    ]
  },
  questionCount: { min: 2, max: 3 },
  questionTemplates: {
    career: {
      keywords: ['career', 'job', 'work', 'move', 'relocate', 'city', 'location'],
      questions: [
        "What's your current career situation and experience level?",
        "What are your main career goals and priorities?",
        "What constraints or requirements do you have for this decision?",
        "What's your timeline for making this change?",
        "What factors are most important to you in this decision?"
      ]
    },
    financial: {
      keywords: ['buy', 'purchase', 'invest', 'money', 'financial', 'budget'],
      questions: [
        "What's your current financial situation and budget?",
        "What are your main financial goals and priorities?",
        "What concerns do you have about this financial decision?",
        "What's your risk tolerance for this investment?",
        "What factors are most important to you in this decision?"
      ]
    },
    relationship: {
      keywords: ['relationship', 'marriage', 'divorce', 'dating', 'partner', 'look for', 'qualities', 'values', 'love'],
      questions: [
        "What qualities are most important to you in a partner?",
        "What values and beliefs are essential for you in a relationship?",
        "What are your deal-breakers and non-negotiables?",
        "What kind of lifestyle and future do you envision together?",
        "What past relationship experiences have taught you about what you want?",
        "How do you prefer to communicate and resolve conflicts?",
        "What are your relationship goals and timeline?",
        "What support system do you have for relationship advice?"
      ]
    },
    education: {
      keywords: ['education', 'school', 'study', 'degree', 'course', 'learn'],
      questions: [
        "What's your current educational background and experience?",
        "What are your main learning goals and objectives?",
        "What constraints do you have for this educational decision?",
        "What's your timeline for completing this education?",
        "What factors are most important to you in choosing this path?"
      ]
    },
    health: {
      keywords: ['health', 'medical', 'doctor', 'treatment', 'therapy', 'wellness'],
      questions: [
        "What's your current health situation and concerns?",
        "What are your main health goals and priorities?",
        "What constraints do you have for this health decision?",
        "What's your timeline for addressing this health matter?",
        "What factors are most important to you in this health decision?"
      ]
    },
    business: {
      keywords: ['business', 'startup', 'company', 'entrepreneur', 'funding', 'investor'],
      questions: [
        "What's your current business situation and experience?",
        "What are your main business goals and objectives?",
        "What constraints do you have for this business decision?",
        "What's your timeline for this business move?",
        "What factors are most important to you in this business decision?"
      ]
    },
    relocation: {
      keywords: ['move', 'relocate', 'city', 'location', 'place', 'area', 'country', 'state', 'abroad', 'overseas'],
      questions: [
        "What's your current location and where are you considering moving?",
        "What's driving your interest in relocating?",
        "What are your main priorities for the new location?",
        "What constraints or requirements do you have for this move?",
        "What's your timeline for making this change?",
        "What factors are most important to you in choosing this location?"
      ]
    },
    generic: {
      keywords: [],
      questions: [
        "What's your current situation and what's driving this decision?",
        "What are your main goals and priorities for this choice?",
        "What constraints or requirements do you have?",
        "What's your timeline for making this decision?",
        "What factors are most important to you in this decision?",
        "What concerns or challenges are you facing?",
        "What would success look like for you in this situation?"
      ]
    }
  },
  confidence: {
    minConfidence: 0.4,  // Lowered from 0.6 to catch more subjective questions
    maxConfidence: 0.9,
    weights: { decisionPatterns: 0.4, vaguePatterns: 0.3, keywords: 0.3 }
  },
  debug: { enabled: true, logPatterns: true, logConfidence: true, logQuestions: true }
};

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://unpack-llm.vercel.app', 'https://tracyyyleung.github.io'] 
    : true,
  credentials: true
}));
app.use(express.json());


// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Enhanced smart detection logic with configurable rules
function needsClarification(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Debug: Check if BACKEND_CONFIG is loaded
  if (!BACKEND_CONFIG || !BACKEND_CONFIG.clarificationRules) {
    console.error('❌ BACKEND_CONFIG not loaded properly:', BACKEND_CONFIG);
    return false;
  }
  
  const config = BACKEND_CONFIG.clarificationRules;
  
  // First check if it's a factual question that should skip clarification
  const shouldSkip = config.skipClarificationPatterns.some(pattern => 
    pattern.test(lowerPrompt)
  );
  
  if (shouldSkip) {
    if (BACKEND_CONFIG.debug.enabled) {
      console.log('🔍 Skipping clarification - factual question detected');
    }
    return false;
  }
  
  // Enhanced pattern matching with typo tolerance
  const decisionScore = enhancedPatternMatching(lowerPrompt, config.decisionPatterns) ? 1 : 0;
  const vagueScore = enhancedPatternMatching(lowerPrompt, config.vaguePatterns) ? 1 : 0;
  const keywordScore = config.clarificationKeywords.some(keyword => 
    lowerPrompt.includes(keyword)
  ) ? 1 : 0;
  
  // Calculate weighted confidence
  const confidence = (
    decisionScore * BACKEND_CONFIG.confidence.weights.decisionPatterns +
    vagueScore * BACKEND_CONFIG.confidence.weights.vaguePatterns +
    keywordScore * BACKEND_CONFIG.confidence.weights.keywords
  );
  
  const needsClarification = confidence >= BACKEND_CONFIG.confidence.minConfidence;
  
  if (BACKEND_CONFIG.debug.enabled) {
    console.log('🔍 Clarification Analysis:', {
      prompt: prompt.substring(0, 50) + '...',
      decisionScore,
      vagueScore,
      keywordScore,
      confidence,
      needsClarification
    });
  }
  
  return needsClarification;
}

// Enhanced pattern matching with typo tolerance
function enhancedPatternMatching(text, patterns) {
  // First try exact regex matching
  if (patterns.some(pattern => pattern.test(text))) {
    return true;
  }
  
  // Then try fuzzy matching for common typos
  const fuzzyPatterns = [
    // Common "should" typos
    /shoul[dt]\s+i\b/, /shoud\s+i\b/, /shoul\s+i\b/,
    // Common "help" typos  
    /hel[pv]\s+me\s+decide\b/, /help\s+me\s+decid\b/,
    // Common "what" typos
    /wha[st]\s+should\s+i\b/, /what\s+shoul[dt]\s+i\b/,
    // Common "worth" typos
    /is\s+it\s+wor[th]\b/, /worth\s+i[t]\b/,
    // Common "advice" typos
    /advi[cs]e\b/, /advise\b/,
    // Common "recommend" typos
    /recom[m]end\b/, /recomend\b/,
    // Common "suggest" typos
    /sug[g]est\b/, /sugest\b/,
    // Common "choose" typos
    /choo[se]\b/, /chose\b/,
    // Common "decide" typos
    /deci[de]\b/, /decid\b/,
    // Common "better" typos
    /bet[ter]\b/, /beter\b/,
    // Common "best" typos
    /be[st]\b/, /bes\b/,
    // Common "compare" typos
    /com[pare]\b/, /comare\b/,
    // Common "opinion" typos
    /opi[ni]on\b/, /opion\b/,
    // Common "thoughts" typos
    /thou[ght]s\b/, /thouts\b/
  ];
  
  return fuzzyPatterns.some(pattern => pattern.test(text));
}

// Detect casual greetings and non-question inputs
function isCasualGreeting(text) {
  const lowerText = text.toLowerCase().trim();
  
  // Common casual greetings and non-question inputs
  const casualPatterns = [
    /^(hello|hi|hey|hiya|howdy)$/,
    /^(test|testing|test123)$/,
    /^(ok|okay|sure|yeah|yep|nope)$/,
    /^(thanks|thank you|thx)$/,
    /^(good|bad|great|awesome|cool|nice)$/,
    /^(yes|no|maybe|perhaps)$/,
    /^(what|huh|eh|um|uh)$/,
    /^(lol|haha|hehe|lmao)$/,
    /^(bye|goodbye|see ya|later)$/,
    /^(how are you|how's it going|what's up)$/,
    /^(good morning|good afternoon|good evening)$/,
    /^(nice to meet you|pleased to meet you)$/,
    /^(how can you help|what can you do)$/,
    /^(who are you|what are you)$/
  ];
  
  return casualPatterns.some(pattern => pattern.test(lowerText));
}

// Enhanced category detection with context analysis
function detectCategoryWithContext(prompt, config) {
  // Priority-based category detection
  const categoryScores = {};
  
  // Check for relocation patterns first (highest priority)
  if (prompt.includes('move') || prompt.includes('relocate') || prompt.includes('city') || 
      prompt.includes('location') || prompt.includes('place') || prompt.includes('area') ||
      prompt.includes('country') || prompt.includes('state') || prompt.includes('abroad') ||
      prompt.includes('overseas') || /\bto\s+\w+\b/.test(prompt)) {
    categoryScores.relocation = 10; // High priority for relocation
  }
  
  // Check other categories with weighted scoring
  Object.entries(config).forEach(([category, template]) => {
    if (category === 'generic' || category === 'relocation') return; // Skip generic and relocation (already handled)
    
    let score = 0;
    
    // Basic keyword matching
    const keywordMatches = template.keywords.filter(keyword => 
      prompt.includes(keyword)
    ).length;
    score += keywordMatches * 2;
    
    // Context-specific patterns
    if (category === 'career') {
      if (prompt.includes('job') || prompt.includes('work') || prompt.includes('career') || 
          prompt.includes('employment') || prompt.includes('profession')) {
        score += 3;
      }
    } else if (category === 'financial') {
      if (prompt.includes('money') || prompt.includes('budget') || prompt.includes('cost') || 
          prompt.includes('price') || prompt.includes('invest') || prompt.includes('buy')) {
        score += 3;
      }
    } else if (category === 'relationship') {
      if (prompt.includes('marriage') || prompt.includes('divorce') || prompt.includes('dating') || 
          prompt.includes('partner') || prompt.includes('love') || prompt.includes('family')) {
        score += 3;
      }
    } else if (category === 'education') {
      if (prompt.includes('school') || prompt.includes('study') || prompt.includes('degree') || 
          prompt.includes('course') || prompt.includes('learn') || prompt.includes('university')) {
        score += 3;
      }
    } else if (category === 'health') {
      if (prompt.includes('medical') || prompt.includes('doctor') || prompt.includes('treatment') || 
          prompt.includes('therapy') || prompt.includes('wellness') || prompt.includes('fitness')) {
        score += 3;
      }
    } else if (category === 'business') {
      if (prompt.includes('startup') || prompt.includes('company') || prompt.includes('entrepreneur') || 
          prompt.includes('funding') || prompt.includes('investor') || prompt.includes('market')) {
        score += 3;
      }
    }
    
    categoryScores[category] = score;
  });
  
  // Find the category with the highest score
  let bestCategory = 'generic';
  let maxScore = 0;
  
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  });
  
  // If relocation has a high score, prioritize it
  if (categoryScores.relocation >= 8) {
    return 'relocation';
  }
  
  return bestCategory;
}

// Generate dynamic contextual response message using Claude
async function generateContextualMessage(prompt, category) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use Haiku for faster response
      max_tokens: 150,
      temperature: 0.8,
            system: `You are an expert at writing direct, context-specific opening messages for clarification requests.

Your task is to write a brief, punchy opening message (1-2 sentences) that:
1. Acknowledges the user's specific question directly
2. Explains why you need more context to help them
3. Uses varied, direct language without repetitive patterns
4. Avoids generic phrases like "understand your situation" when it doesn't fit

Guidelines:
- Be specific to the topic (movies, books, places, etc.)
- Use direct, conversational language without excessive enthusiasm
- Keep it concise (1-2 sentences max)
- Avoid exclamation marks and overly optimistic language
- Be straightforward and to the point
- Vary your opening patterns - don't always use "Drop your question" format

Opening Pattern Variations:
- "Movie preferences are personal. Let me understand what you enjoy watching."
- "Finding the right place depends on many factors. Let me learn about your priorities."
- "There are many great books out there. Let me understand your reading tastes and goals."
- "Choosing the best option requires knowing your specific needs. What matters most to you?"
- "This decision depends on several factors. Tell me about your situation and goals."
- "To give you the best advice, I need to understand your preferences and constraints."
- "The right choice varies for everyone. What are your main priorities here?"
- "This is a complex decision. Let me learn about your specific circumstances."

Write a direct, context-appropriate opening message for this specific question using varied language patterns.`,
      messages: [
        {
          role: 'user',
          content: `User's question: "${prompt}"\n\nWrite a brief, direct opening message that acknowledges their specific question and explains why you need more context to help them.`
        }
      ]
    });

    const message = response.content[0].text.trim().replace(/^["']|["']$/g, '');
    
    if (BACKEND_CONFIG.debug.enabled) {
      console.log('💬 Contextual Message Generation:', {
        prompt: prompt.substring(0, 50) + '...',
        message: message
      });
    }

    return message;
  } catch (error) {
    console.error('Error generating contextual message:', error);
    // Fallback to a simple generic message
    return "Let me understand your preferences better so I can give you the most relevant advice.";
  }
}

// Detect category from user's clarification answers
function detectCategoryFromAnswers(answers) {
  const combinedAnswers = answers.join(' ').toLowerCase();
  
  // Check for specific category indicators in the answers
  if (combinedAnswers.includes('career') || combinedAnswers.includes('job') || 
      combinedAnswers.includes('work') || combinedAnswers.includes('professional') ||
      combinedAnswers.includes('employment') || combinedAnswers.includes('career change')) {
    return 'career';
  }
  
  if (combinedAnswers.includes('money') || combinedAnswers.includes('budget') || 
      combinedAnswers.includes('cost') || combinedAnswers.includes('financial') ||
      combinedAnswers.includes('invest') || combinedAnswers.includes('afford')) {
    return 'financial';
  }
  
  if (combinedAnswers.includes('relationship') || combinedAnswers.includes('marriage') || 
      combinedAnswers.includes('partner') || combinedAnswers.includes('family') ||
      combinedAnswers.includes('love') || combinedAnswers.includes('dating')) {
    return 'relationship';
  }
  
  if (combinedAnswers.includes('education') || combinedAnswers.includes('school') || 
      combinedAnswers.includes('study') || combinedAnswers.includes('learn') ||
      combinedAnswers.includes('degree') || combinedAnswers.includes('course')) {
    return 'education';
  }
  
  if (combinedAnswers.includes('health') || combinedAnswers.includes('medical') || 
      combinedAnswers.includes('doctor') || combinedAnswers.includes('wellness') ||
      combinedAnswers.includes('fitness') || combinedAnswers.includes('treatment')) {
    return 'health';
  }
  
  if (combinedAnswers.includes('business') || combinedAnswers.includes('startup') || 
      combinedAnswers.includes('company') || combinedAnswers.includes('entrepreneur') ||
      combinedAnswers.includes('market') || combinedAnswers.includes('funding')) {
    return 'business';
  }
  
  if (combinedAnswers.includes('move') || combinedAnswers.includes('relocate') || 
      combinedAnswers.includes('location') || combinedAnswers.includes('city') ||
      combinedAnswers.includes('place') || combinedAnswers.includes('abroad')) {
    return 'relocation';
  }
  
  return 'generic';
}

// Create tailored system prompt based on detected category
function createTailoredSystemPrompt(personality, category, isFollowUpAnswer = false) {
  const basePrompt = createSystemPrompt(personality);
  
  const categoryContexts = {
    career: "\n\nFocus on career development, professional growth, job market considerations, and work-life balance in your response.",
    financial: "\n\nFocus on financial planning, budgeting, investment considerations, and cost-benefit analysis in your response.",
    relationship: "\n\nFocus on relationship dynamics, communication, emotional considerations, and personal fulfillment in your response.",
    education: "\n\nFocus on learning outcomes, educational opportunities, skill development, and academic considerations in your response.",
    health: "\n\nFocus on health and wellness, medical considerations, lifestyle factors, and wellbeing in your response.",
    business: "\n\nFocus on business strategy, market analysis, entrepreneurial considerations, and professional growth in your response.",
    relocation: "\n\nFocus on location-specific factors, lifestyle changes, practical considerations, and quality of life in your response.",
    generic: "\n\nProvide comprehensive advice considering all relevant factors and perspectives."
  };
  
  const categoryContext = categoryContexts[category] || categoryContexts.generic;
  
  // If this is a follow-up answer after clarifications, skip the friendly opener
  if (isFollowUpAnswer) {
    const followUpInstruction = "\n\nIMPORTANT: This is a follow-up answer after the user has provided additional context through clarification questions. Do NOT start with phrases like 'That's a great question!', 'I understand your concern', or similar acknowledgments. Jump straight into the advice and analysis.";
    return basePrompt + categoryContext + followUpInstruction;
  }
  
  return basePrompt + categoryContext;
}

// Enhanced question generation with contextual templates
async function generateClarifyingQuestions(prompt) {
  try {
    const questionCount = BACKEND_CONFIG.questionCount;
    const numQuestions = Math.floor(Math.random() * (questionCount.max - questionCount.min + 1)) + questionCount.min;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use Haiku for faster response
      max_tokens: 500,
      temperature: 0.7,
      system: `You are an expert at asking clarifying questions to help people make better decisions.

Your task is to generate ${numQuestions} specific, thoughtful clarifying questions based on the user's question. These questions should help gather context that would be useful for providing a personalized, helpful answer.

Guidelines:
1. Make questions specific to the user's actual question, not generic
2. Focus on gathering personal context, preferences, constraints, and goals
3. Ask about their current situation, experience level, and what they're trying to achieve
4. Make questions conversational and easy to understand
5. Avoid yes/no questions - ask for details and explanations
6. Each question should be on a separate line
7. Don't include numbers or bullet points, just the questions

Examples:
- For "what's the best book to read" → ask about their reading preferences, favorite genres, experience level, goals
- For "what's the best place to live" → ask about their lifestyle, priorities, budget, career, family situation
- For "what's the best restaurant" → ask about their cuisine preferences, occasion, budget, location, dietary restrictions

Generate exactly ${numQuestions} questions that are directly relevant to this specific question.`,
      messages: [
        {
          role: 'user',
          content: `User's question: "${prompt}"\n\nGenerate ${numQuestions} clarifying questions to help provide a personalized answer.`
        }
      ]
    });

    const questionsText = response.content[0].text;
    
    // Parse the questions from the response
    const questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.match(/^\d+\./)) // Remove empty lines and numbered lists
    .slice(0, numQuestions);
  
    if (questions.length === 0) {
      // Fallback to generic questions if parsing fails
      return BACKEND_CONFIG.questionTemplates.generic.questions.slice(0, numQuestions);
    }
  
  if (BACKEND_CONFIG.debug.enabled) {
    console.log('❓ Question Generation:', {
      prompt: prompt.substring(0, 50) + '...',
      numQuestions,
        questions: questions
      });
    }

    return questions;
  } catch (error) {
    console.error('Error generating clarifying questions:', error);
    // Fallback to generic questions
    const questionCount = BACKEND_CONFIG.questionCount;
    const numQuestions = Math.floor(Math.random() * (questionCount.max - questionCount.min + 1)) + questionCount.min;
    return BACKEND_CONFIG.questionTemplates.generic.questions.slice(0, numQuestions);
  }
}

// Configurable model parameters
const MODEL_CONFIG = {
  // Available models (choose based on your needs and budget)
  models: {
    'claude-3-haiku-20240307': {
      name: 'Claude 3 Haiku',
      cost: 'Lowest',
      speed: 'Fastest',
      quality: 'Good',
      maxTokens: 200000,
      description: 'Fast and cost-effective for most tasks'
    },
    'claude-3-sonnet-20240229': {
      name: 'Claude 3 Sonnet',
      cost: 'Medium',
      speed: 'Medium',
      quality: 'High',
      maxTokens: 200000,
      description: 'Balanced performance and quality'
    },
    'claude-3-opus-20240229': {
      name: 'Claude 3 Opus',
      cost: 'Highest',
      speed: 'Slowest',
      quality: 'Highest',
      maxTokens: 200000,
      description: 'Best quality for complex reasoning'
    }
  },
  
  // Default model selection
  defaultModel: 'claude-3-haiku-20240307',
  
  // Response parameters
  parameters: {
    maxTokens: 1500,
    temperature: 0.7,  // 0.0 = deterministic, 1.0 = creative
    topP: 0.9,         // Nucleus sampling
    topK: 40,          // Top-k sampling
    stopSequences: [], // Stop generation at these sequences
    repetitionPenalty: 1.0
  }
};

// Enhanced system prompt with configurable personality
const createSystemPrompt = (personality = 'helpful', isCasualGreeting = false) => {
  const personalities = {
    helpful: `You're a helpful AI assistant who gives practical, actionable advice.

When responding to user questions:
1. Start with an appropriate acknowledgment based on the question type:
   - For casual greetings (hello, hi, test, etc.): Simply respond with "How can I assist you today?" or "What can I help you with?"
   - For basic factual questions (weather, health symptoms, simple how/what/when/where): Start directly with the answer - NO acknowledgments like "That's a great question" or "That's a good question"
   - For decision-making questions: Use direct acknowledgments like "That's a good question", "I understand your concern", "This is an important decision"
   - For complex or thoughtful questions: Use appreciative acknowledgments like "That's a thoughtful question", "I appreciate you asking this"
   - Only use these acknowledgments for the first response to a new question, not for follow-up answers after clarification
2. Be direct and helpful - like talking to a knowledgeable friend
3. Use natural, conversational language without excessive enthusiasm
4. Keep responses concise but thorough - get to the point while being helpful
5. Use bullet points or short paragraphs for easy reading
6. End simply and directly - avoid overly encouraging phrases like "Let me know if you have any other questions!"
7. Use "you" and "your" to keep it personal
8. Focus on providing clear, useful information

Be like a knowledgeable friend who gives straightforward, helpful advice.`,

    professional: `You're a knowledgeable professional AI consultant who delivers expert advice with confidence and clarity.

Your responses should:
1. Start with an appropriate professional acknowledgment based on the question type:
   - For casual greetings (hello, hi, test, etc.): Simply respond with "How can I assist you today?" or "What can I help you with?"
   - For basic factual questions (weather, health symptoms, simple how/what/when/where): Start directly with the answer - NO acknowledgments like "That's a great question" or "That's a good question"
   - For decision-making questions: Use professional acknowledgments like "That's a good question", "This is a smart approach", "I'm here to help"
   - For complex strategic questions: Use appreciative acknowledgments like "That's a thoughtful question", "I appreciate the complexity of this situation"
   - Only use these acknowledgments for the first response to a new question, not for follow-up answers after clarification
2. Be authoritative but approachable - mix expertise with genuine care
3. Include specific examples and actionable steps
4. Use bullet points and short paragraphs for clarity
5. Be direct and concise - get to the point efficiently
6. End simply and directly - avoid overly encouraging phrases like "Let me know if you have any other questions!"
7. Use "you" and "your" to keep it personal
8. Focus on providing clear, actionable insights

Be like an experienced consultant who provides straightforward, expert advice.`,

    friendly: `You're a supportive AI companion who provides advice like a caring, understanding friend.

Your responses should:
1. Start with an appropriate warm acknowledgment based on the question type:
   - For casual greetings (hello, hi, test, etc.): Simply respond with "How can I assist you today?" or "What can I help you with?"
   - For basic factual questions (weather, health symptoms, simple how/what/when/where): Start directly with the answer - NO acknowledgments like "That's a great question" or "That's a good question"
   - For decision-making questions: Use encouraging acknowledgments like "I appreciate you sharing this", "That's a thoughtful question", "I'm glad you're thinking about this"
   - For personal or emotional questions: Use caring acknowledgments like "I understand this is important to you", "Thank you for trusting me with this"
   - Only use these acknowledgments for the first response to a new question, not for follow-up answers after clarification
2. Be warm and genuinely caring about helping
3. Use conversational, friendly language without excessive enthusiasm
4. Show real care and understanding for their situation
5. Provide emotional support alongside practical advice
6. Use relatable examples and analogies
7. End simply and directly - avoid overly encouraging phrases like "Let me know if you have any other questions!"
8. Use "you" and "your" to keep it personal

Be like a supportive friend who provides straightforward, caring advice.`
  };

  return personalities[personality] || personalities.helpful;
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Model configuration endpoint
app.get('/api/models', (req, res) => {
  res.json({
    availableModels: MODEL_CONFIG.models,
    defaultModel: MODEL_CONFIG.defaultModel,
    parameters: MODEL_CONFIG.parameters,
    personalities: ['helpful', 'professional', 'friendly']
  });
});

// Backend configuration endpoint
app.get('/api/backend-config', (req, res) => {
  res.json({
    clarificationRules: BACKEND_CONFIG.clarificationRules,
    questionCount: BACKEND_CONFIG.questionCount,
    questionTemplates: BACKEND_CONFIG.questionTemplates,
    confidence: BACKEND_CONFIG.confidence,
    responses: BACKEND_CONFIG.responses,
    debug: BACKEND_CONFIG.debug
  });
});

// Update backend configuration endpoint
app.post('/api/backend-config', (req, res) => {
  try {
    const { 
      clarificationRules, 
      questionCount, 
      questionTemplates, 
      confidence, 
      responses, 
      debug 
    } = req.body;
    
    // Update configuration
    if (clarificationRules) {
      Object.assign(BACKEND_CONFIG.clarificationRules, clarificationRules);
    }
    if (questionCount) {
      Object.assign(BACKEND_CONFIG.questionCount, questionCount);
    }
    if (questionTemplates) {
      Object.assign(BACKEND_CONFIG.questionTemplates, questionTemplates);
    }
    if (confidence) {
      Object.assign(BACKEND_CONFIG.confidence, confidence);
    }
    if (responses) {
      Object.assign(BACKEND_CONFIG.responses, responses);
    }
    if (debug !== undefined) {
      Object.assign(BACKEND_CONFIG.debug, debug);
    }
    
    res.json({
      success: true,
      message: 'Backend configuration updated',
      config: BACKEND_CONFIG
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update backend configuration' });
  }
});

// Update model configuration endpoint
app.post('/api/configure', (req, res) => {
  try {
    const { model, personality, maxTokens, temperature } = req.body;
    
    // Validate model
    if (model && !MODEL_CONFIG.models[model]) {
      return res.status(400).json({ 
        error: 'Invalid model', 
        availableModels: Object.keys(MODEL_CONFIG.models) 
      });
    }
    
    // Validate personality
    const validPersonalities = ['helpful', 'professional', 'friendly'];
    if (personality && !validPersonalities.includes(personality)) {
      return res.status(400).json({ 
        error: 'Invalid personality', 
        validPersonalities 
      });
    }
    
    // Update configuration
    if (model) MODEL_CONFIG.defaultModel = model;
    if (personality) MODEL_CONFIG.parameters.personality = personality;
    if (maxTokens) MODEL_CONFIG.parameters.maxTokens = Math.max(100, Math.min(200000, maxTokens));
    if (temperature !== undefined) MODEL_CONFIG.parameters.temperature = Math.max(0, Math.min(1, temperature));
    
    res.json({
      success: true,
      message: 'Configuration updated',
      currentConfig: {
        model: MODEL_CONFIG.defaultModel,
        personality: MODEL_CONFIG.parameters.personality || 'helpful',
        maxTokens: MODEL_CONFIG.parameters.maxTokens,
        temperature: MODEL_CONFIG.parameters.temperature
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Check if clarification is needed and respond accordingly
app.post('/api/check-and-respond', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Check if clarification is needed
    const needsClarificationResult = needsClarification(prompt);
    
    if (needsClarificationResult) {
      // Generate clarifying questions
      const questions = await generateClarifyingQuestions(prompt);
      
      // Determine category for contextual messaging
      const lowerPrompt = prompt.toLowerCase();
      const config = BACKEND_CONFIG.questionTemplates;
      let selectedCategory = 'generic';
      let maxMatches = 0;
      
      Object.entries(config).forEach(([category, template]) => {
        if (category === 'generic') return;
        const matches = template.keywords.filter(keyword => 
          lowerPrompt.includes(keyword)
        ).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          selectedCategory = category;
        }
      });
      
      // Generate contextual message
      const contextualMessage = await generateContextualMessage(prompt, selectedCategory);
      
      return res.json({
        needsClarification: true,
        questions: questions,
        message: contextualMessage
      });
    } else {
      // Generate direct answer with configurable parameters
      const model = req.body.model || MODEL_CONFIG.defaultModel;
      const personality = req.body.personality || 'helpful';
      const maxTokens = req.body.maxTokens || MODEL_CONFIG.parameters.maxTokens;
      
      // Check if it's a casual greeting
      const isCasual = isCasualGreeting(prompt);
      
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: MODEL_CONFIG.parameters.temperature,
        system: createSystemPrompt(personality, isCasual),
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });
      
      return res.json({
        needsClarification: false,
        answer: response.content[0].text
      });
    }
  } catch (error) {
    console.error('Error in /api/check-and-respond:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your Anthropic API key.' });
    } else if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.status === 400) {
      return res.status(400).json({ error: 'Invalid request. Please check your input.' });
    } else {
      return res.status(500).json({ 
        error: 'Failed to process request. Please try again.',
        details: error.message 
      });
    }
  }
});

// Generate final answer with user's context
app.post('/api/generate-final', async (req, res) => {
  try {
    const { prompt, clarifications, skipClarifications } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    let contextPrompt = prompt;
    
    // Detect category from user's answers to tailor the response
    let detectedCategory = 'generic';
    let isFollowUpAnswer = false;
    
    // Check if this is a follow-up response (either with answers or skipped)
    // We can detect this by checking if the request came from the clarification flow
    const isFromClarificationFlow = req.body.fromClarificationFlow || false;
    
    if (isFromClarificationFlow) {
      isFollowUpAnswer = true; // This is a follow-up answer after clarifications were requested
    
    if (!skipClarifications && clarifications && clarifications.length > 0) {
        detectedCategory = detectCategoryFromAnswers(clarifications);
        
      // Add clarifications to the prompt
      const clarificationText = clarifications
        .filter(clarification => clarification.trim())
        .map((clarification, index) => `Additional context ${index + 1}: ${clarification}`)
        .join('\n');
      
      if (clarificationText) {
        contextPrompt = `${prompt}\n\nAdditional context:\n${clarificationText}`;
        }
      }
    }
    
    // Use configurable parameters for final answer generation
    const model = req.body.model || MODEL_CONFIG.defaultModel;
    const personality = req.body.personality || 'helpful';
    const maxTokens = req.body.maxTokens || MODEL_CONFIG.parameters.maxTokens;
    
    // Create a tailored system prompt based on detected category and whether it's a follow-up
    const tailoredSystemPrompt = createTailoredSystemPrompt(personality, detectedCategory, isFollowUpAnswer);
    
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens,
      temperature: MODEL_CONFIG.parameters.temperature,
      system: tailoredSystemPrompt,
      messages: [
        {
          role: 'user',
          content: contextPrompt
        }
      ]
    });
    
    res.json({
      answer: response.content[0].text
    });
    
  } catch (error) {
    console.error('Error in /api/generate-final:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your Anthropic API key.' });
    } else if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.status === 400) {
      return res.status(400).json({ error: 'Invalid request. Please check your input.' });
    } else {
      return res.status(500).json({ 
        error: 'Failed to generate answer. Please try again.',
        details: error.message 
      });
    }
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key loaded: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
  if (process.env.ANTHROPIC_API_KEY) {
    console.log(`API Key starts with: ${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...`);
  }
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
});