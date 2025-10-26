# 🎛️ Fine-Tuning Guide for Intent Clarifier

## Overview
This guide explains how to fine-tune your Intent Clarifier's AI responses by adjusting model parameters, personalities, and configurations.

## 🚀 Quick Start

### 1. Access Configuration
- Click the **"Configure AI"** button in the top-right corner of the chat interface
- This opens the Model Configuration modal

### 2. Basic Settings
- **Model**: Choose between Claude 3 Haiku, Sonnet, or Opus
- **Personality**: Select helpful, professional, or friendly tone
- **Max Tokens**: Control response length (100-2000)
- **Creativity**: Adjust temperature (0.0-1.0)

## 🎯 Model Selection Guide

### Claude 3 Haiku (Default)
- **Best for**: Quick responses, cost-sensitive applications
- **Speed**: Fastest
- **Cost**: Lowest
- **Quality**: Good
- **Use cases**: General questions, simple advice

### Claude 3 Sonnet
- **Best for**: Balanced performance and quality
- **Speed**: Medium
- **Cost**: Medium
- **Quality**: High
- **Use cases**: Complex reasoning, detailed analysis

### Claude 3 Opus
- **Best for**: Expert-level advice, complex problem solving
- **Speed**: Slowest
- **Cost**: Highest
- **Quality**: Highest
- **Use cases**: Expert consultation, complex reasoning

## 🎭 Personality Types

### Helpful Assistant (Default)
- **Tone**: Warm, supportive, practical
- **Style**: Empathetic and understanding
- **Best for**: Personal advice, general questions
- **Example**: "I understand your situation. Here's what I recommend..."

### Professional Consultant
- **Tone**: Authoritative, direct, analytical
- **Style**: Expert-level, well-researched
- **Best for**: Business decisions, technical questions
- **Example**: "Based on industry best practices, I recommend..."

### Friendly Companion
- **Tone**: Conversational, encouraging, supportive
- **Style**: Warm and encouraging
- **Best for**: Personal support, motivation
- **Example**: "Hey! I'm here to help. Let's work through this together..."

## ⚙️ Parameter Tuning

### Temperature (Creativity)
- **0.0-0.3**: Very deterministic, consistent responses
- **0.4-0.7**: Balanced creativity and consistency (recommended)
- **0.8-1.0**: Very creative, varied responses

### Max Tokens (Response Length)
- **100-500**: Short, concise responses
- **500-1000**: Medium-length responses (recommended)
- **1000-2000**: Detailed, comprehensive responses

## 🔧 Advanced Configuration

### API Endpoints

#### Get Available Models
```bash
curl http://localhost:5001/api/models
```

#### Update Configuration
```bash
curl -X POST http://localhost:5001/api/configure \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "personality": "professional",
    "maxTokens": 1000,
    "temperature": 0.5
  }'
```

#### Test with Custom Parameters
```bash
curl -X POST http://localhost:5001/api/check-and-respond \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Should I change careers?",
    "model": "claude-3-sonnet-20240229",
    "personality": "professional",
    "temperature": 0.5
  }'
```

## 📊 Performance Optimization

### Cost Optimization
1. **Use Haiku for simple questions** - 10x cheaper than Opus
2. **Lower max tokens** - Reduces API costs
3. **Cache responses** - Avoid repeated API calls

### Speed Optimization
1. **Use Haiku model** - Fastest response times
2. **Lower max tokens** - Faster generation
3. **Optimize prompts** - Clearer prompts = better responses

### Quality Optimization
1. **Use Sonnet/Opus** - Higher quality responses
2. **Adjust temperature** - Fine-tune creativity vs consistency
3. **Custom personalities** - Tailor responses to your use case

## 🎨 Custom Personalities

### Creating Custom Personalities
Edit `/server/server.js` and add to the `personalities` object:

```javascript
const personalities = {
  // ... existing personalities
  'expert': `You are an expert consultant with deep domain knowledge.
  
  Your responses should:
  1. Be authoritative and well-researched
  2. Include specific examples and case studies
  3. Provide step-by-step action plans
  4. Reference industry best practices
  5. Be direct and concise
  6. Include risk assessments and alternatives
  
  Maintain an expert tone while being approachable.`
};
```

### Custom System Prompts
Modify the `createSystemPrompt` function to add domain-specific instructions:

```javascript
const createSystemPrompt = (personality = 'helpful', domain = 'general') => {
  const domainPrompts = {
    'medical': 'You are a medical AI assistant. Always recommend consulting healthcare professionals for medical advice.',
    'legal': 'You are a legal AI assistant. Always recommend consulting qualified attorneys for legal matters.',
    'financial': 'You are a financial AI assistant. Always recommend consulting financial advisors for investment decisions.'
  };
  
  // Combine personality and domain-specific prompts
  return `${personalities[personality]}\n\n${domainPrompts[domain] || ''}`;
};
```

## 🔍 Monitoring and Analytics

### Response Quality Metrics
- **Relevance**: How well responses match user intent
- **Completeness**: Whether responses address all aspects
- **Clarity**: How clear and understandable responses are
- **Actionability**: Whether responses provide actionable advice

### A/B Testing
1. **Test different models** with the same prompts
2. **Compare personalities** for different use cases
3. **Measure user satisfaction** with different configurations
4. **Track response times** and costs

## 🚨 Troubleshooting

### Common Issues

#### "Model not found" Error
- **Cause**: Model name is incorrect or not available
- **Solution**: Use `claude-3-haiku-20240307` (confirmed working)

#### "Invalid API key" Error
- **Cause**: API key is incorrect or expired
- **Solution**: Check your `.env` file and update the key

#### Slow Response Times
- **Cause**: Using Opus model or high max tokens
- **Solution**: Switch to Haiku or reduce max tokens

#### Poor Response Quality
- **Cause**: Wrong personality or temperature settings
- **Solution**: Adjust personality and temperature parameters

## 📈 Best Practices

### 1. Start Simple
- Begin with Haiku model and helpful personality
- Use default parameters (temperature: 0.7, maxTokens: 1500)

### 2. Iterate Based on Use Case
- **Personal advice**: Use friendly personality
- **Business decisions**: Use professional personality
- **Technical questions**: Use professional personality with Sonnet

### 3. Monitor Performance
- Track response quality and user satisfaction
- Adjust parameters based on feedback
- A/B test different configurations

### 4. Cost Management
- Use Haiku for most queries
- Only use Sonnet/Opus for complex reasoning
- Set appropriate max tokens limits

## 🎯 Use Case Examples

### Personal Life Decisions
```json
{
  "model": "claude-3-haiku-20240307",
  "personality": "friendly",
  "temperature": 0.7,
  "maxTokens": 800
}
```

### Business Strategy
```json
{
  "model": "claude-3-sonnet-20240229",
  "personality": "professional",
  "temperature": 0.5,
  "maxTokens": 1500
}
```

### Technical Analysis
```json
{
  "model": "claude-3-opus-20240229",
  "personality": "professional",
  "temperature": 0.3,
  "maxTokens": 2000
}
```

## 🔄 Continuous Improvement

### Regular Updates
1. **Monitor API changes** - Anthropic updates models regularly
2. **Test new models** - Try new model versions as they become available
3. **Update configurations** - Adjust parameters based on performance
4. **Gather feedback** - Collect user feedback to improve responses

### Performance Monitoring
- Track response times
- Monitor API costs
- Measure user satisfaction
- Analyze response quality

---

## 🎉 Conclusion

Fine-tuning your Intent Clarifier is an iterative process. Start with the defaults, test different configurations, and adjust based on your specific use case and user feedback. The key is finding the right balance between cost, speed, and quality for your needs.

For more advanced customization, you can modify the server code directly or create custom personalities and system prompts tailored to your specific domain.
