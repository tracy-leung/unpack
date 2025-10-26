# 🎛️ Backend Fine-Tuning Guide

## Overview
This guide explains how to fine-tune the **backend logic** for when to ask clarifying questions, how many to ask, and what questions to generate.

## 🔧 Configuration Files

### Main Configuration: `backend-config.js`
This file contains all the rules and settings for the clarification logic.

### Key Sections:
1. **Clarification Detection Rules** - When to ask questions
2. **Question Generation Rules** - What questions to ask
3. **Advanced Configuration** - Confidence thresholds, weights, etc.

## 📊 Current Rules Analysis

### When Clarification is Triggered:

#### 1. **Decision-Making Patterns** (Weight: 0.4)
```javascript
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
  // ... more patterns
]
```

#### 2. **Vague Question Patterns** (Weight: 0.3)
```javascript
vaguePatterns: [
  /\bwhat\s+do\s+you\s+think\b/,    // "what do you think"
  /\bopinion\b/,                    // "opinion"
  /\bthoughts\b/,                  // "thoughts"
  /\bhow\s+about\b/,               // "how about"
  /\bwhat\s+about\b/,              // "what about"
  // ... more patterns
]
```

#### 3. **Keywords** (Weight: 0.3)
```javascript
clarificationKeywords: [
  // Life decisions
  'career', 'job', 'work', 'move', 'relocate', 'city', 'location',
  'buy', 'purchase', 'invest', 'money', 'financial', 'budget',
  'relationship', 'marriage', 'divorce', 'dating', 'partner',
  'education', 'school', 'study', 'degree', 'course',
  'health', 'medical', 'doctor', 'treatment', 'therapy',
  // ... more keywords
]
```

### When Clarification is SKIPPED:

#### Factual Questions (Auto-skip)
```javascript
skipClarificationPatterns: [
  /^what\s+is\b/,                   // "what is"
  /^how\s+to\b/,                    // "how to"
  /^define\b/,                      // "define"
  /^explain\b/,                     // "explain"
  /^calculate\b/,                   // "calculate"
  /^convert\b/,                     // "convert"
  // ... more patterns
]
```

## 🎯 Question Generation Rules

### Question Categories:

#### 1. **Career Questions**
- **Keywords**: career, job, work, employment, profession
- **Questions**: 5 predefined questions
- **Example**: "What's your current career situation and experience level?"

#### 2. **Location Questions**
- **Keywords**: move, relocate, city, location, place, area
- **Questions**: 5 predefined questions
- **Example**: "What's your current location and where are you considering moving?"

#### 3. **Financial Questions**
- **Keywords**: buy, purchase, invest, money, financial, budget, cost, price
- **Questions**: 5 predefined questions
- **Example**: "What's your budget range for this decision?"

#### 4. **Relationship Questions**
- **Keywords**: relationship, marriage, divorce, dating, partner, love
- **Questions**: 5 predefined questions
- **Example**: "What's the current state of your relationship?"

#### 5. **Education Questions**
- **Keywords**: education, school, study, degree, course, learning
- **Questions**: 5 predefined questions
- **Example**: "What's your current educational background?"

#### 6. **Health Questions**
- **Keywords**: health, medical, doctor, treatment, therapy, wellness
- **Questions**: 5 predefined questions
- **Example**: "What specific health concerns or goals do you have?"

#### 7. **Business Questions**
- **Keywords**: business, startup, company, entrepreneur, funding, hire
- **Questions**: 5 predefined questions
- **Example**: "What's your current business situation and experience?"

#### 8. **Generic Questions**
- **Keywords**: None (fallback)
- **Questions**: 5 generic questions
- **Example**: "What's your current situation regarding this topic?"

### Question Selection Logic:
1. **Find best matching category** based on keyword matches
2. **Select 2-4 questions** (configurable)
3. **Randomly shuffle** to avoid repetition
4. **Fall back to generic** if no category matches

## ⚙️ Fine-Tuning Parameters

### 1. **Confidence Thresholds**
```javascript
confidence: {
  minConfidence: 0.6,        // Minimum to ask questions
  maxConfidence: 0.9,        // Maximum to skip questions
  weights: {
    decisionPatterns: 0.4,   // Weight for decision patterns
    vaguePatterns: 0.3,       // Weight for vague patterns
    keywords: 0.3            // Weight for keyword matching
  }
}
```

### 2. **Question Count**
```javascript
questionCount: {
  min: 2,           // Minimum questions to ask
  max: 4,           // Maximum questions to ask
  default: 3        // Default number of questions
}
```

### 3. **Response Messages**
```javascript
responses: {
  clarificationMessage: "I'd like to understand your situation better...",
  directAnswerMessage: "I can provide you with a direct answer...",
  skipMessage: "I'll provide you with a general answer...",
  submitMessage: "Thank you for providing that context..."
}
```

## 🔍 Debugging and Monitoring

### Enable Debug Mode:
```javascript
debug: {
  enabled: true,              // Enable debug logging
  logPatterns: true,         // Log which patterns matched
  logConfidence: true,        // Log confidence scores
  logQuestions: true         // Log generated questions
}
```

### Debug Output Example:
```
🔍 Clarification Analysis: {
  prompt: "Should I move to New York?",
  decisionScore: 1,
  vagueScore: 0,
  keywordScore: 1,
  confidence: 0.7,
  needsClarification: true
}

❓ Question Generation: {
  prompt: "Should I move to New York?",
  selectedCategory: "location",
  maxMatches: 1,
  numQuestions: 3,
  questions: [
    "What's your current location and where are you considering moving?",
    "What's driving your interest in relocating?",
    "What are your main priorities for the new location?"
  ]
}
```

## 🛠️ How to Fine-Tune

### 1. **Adjust Confidence Thresholds**
```javascript
// Make it more likely to ask questions
confidence: {
  minConfidence: 0.4,  // Lower threshold
  maxConfidence: 0.8   // Higher threshold
}
```

### 2. **Modify Pattern Weights**
```javascript
// Give more weight to keywords, less to patterns
weights: {
  decisionPatterns: 0.2,  // Reduce pattern weight
  vaguePatterns: 0.2,     // Reduce pattern weight
  keywords: 0.6           // Increase keyword weight
}
```

### 3. **Add New Patterns**
```javascript
decisionPatterns: [
  // ... existing patterns
  /\bam\s+i\s+making\s+the\s+right\b/,  // "am I making the right"
  /\bwhat\s+would\s+you\s+do\b/        // "what would you do"
]
```

### 4. **Add New Keywords**
```javascript
clarificationKeywords: [
  // ... existing keywords
  'retirement', 'pension', 'savings',    // Financial planning
  'parenting', 'children', 'family',     // Family decisions
  'travel', 'vacation', 'trip'           // Travel decisions
]
```

### 5. **Customize Question Templates**
```javascript
questionTemplates: {
  // Add new category
  travel: {
    keywords: ['travel', 'vacation', 'trip', 'destination'],
    questions: [
      "What's your budget for this trip?",
      "What type of experience are you looking for?",
      "What's your timeline for this travel?",
      "What are your main priorities for this trip?",
      "What are your main concerns about this travel?"
    ]
  }
}
```

## 📈 Performance Optimization

### 1. **Reduce False Positives**
- Increase `minConfidence` threshold
- Add more specific patterns
- Refine keyword lists

### 2. **Increase Question Relevance**
- Add more specific keywords per category
- Create more targeted question templates
- Adjust category matching logic

### 3. **Improve User Experience**
- Customize response messages
- Adjust question count based on complexity
- Add category-specific question selection

## 🧪 Testing Your Changes

### 1. **Enable Debug Mode**
```javascript
debug: {
  enabled: true,
  logPatterns: true,
  logConfidence: true,
  logQuestions: true
}
```

### 2. **Test Different Prompts**
```bash
# Test decision-making prompts
curl -X POST http://localhost:5001/api/check-and-respond \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Should I change careers?"}'

# Test factual prompts (should skip)
curl -X POST http://localhost:5001/api/check-and-respond \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is React?"}'

# Test vague prompts
curl -X POST http://localhost:5001/api/check-and-respond \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What do you think about remote work?"}'
```

### 3. **Monitor Results**
- Check debug logs for pattern matching
- Verify confidence scores
- Test question generation
- Validate user experience

## 🔄 API Endpoints

### Get Current Configuration:
```bash
curl http://localhost:5001/api/backend-config
```

### Update Configuration:
```bash
curl -X POST http://localhost:5001/api/backend-config \
  -H "Content-Type: application/json" \
  -d '{
    "questionCount": {
      "min": 2,
      "max": 5,
      "default": 3
    },
    "confidence": {
      "minConfidence": 0.5
    }
  }'
```

## 🎯 Best Practices

### 1. **Start Conservative**
- Begin with higher confidence thresholds
- Use fewer, more targeted questions
- Monitor user feedback

### 2. **Iterate Based on Data**
- Track which patterns work best
- Monitor question relevance
- Adjust based on user behavior

### 3. **Test Thoroughly**
- Test edge cases
- Verify factual questions are skipped
- Ensure decision questions trigger clarification

### 4. **Document Changes**
- Keep track of configuration changes
- Document why changes were made
- Maintain version control

## 🚀 Advanced Customization

### 1. **Custom Pattern Matching**
```javascript
// Add complex pattern matching
const customPatterns = [
  /\b(?:should|would|could)\s+i\s+(?:be|do|go|stay|leave)\b/,
  /\b(?:is|would)\s+it\s+(?:worth|good|bad|smart|wise)\b/
];
```

### 2. **Dynamic Question Selection**
```javascript
// Select questions based on prompt complexity
function selectQuestionsByComplexity(prompt, questions) {
  const complexity = prompt.split(' ').length;
  if (complexity > 20) return questions.slice(0, 4);
  if (complexity > 10) return questions.slice(0, 3);
  return questions.slice(0, 2);
}
```

### 3. **Context-Aware Question Generation**
```javascript
// Generate questions based on previous conversation
function generateContextualQuestions(prompt, conversationHistory) {
  // Analyze conversation history
  // Generate questions based on context
  // Return personalized questions
}
```

---

## 🎉 Conclusion

The backend fine-tuning system gives you complete control over when and how clarifying questions are asked. Start with the default configuration, monitor the results, and iteratively improve based on your specific use case and user feedback.

Remember to test thoroughly and document your changes for future reference!
