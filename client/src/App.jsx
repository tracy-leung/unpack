import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Textarea } from './components/ui/textarea';
import AvatarFallback from './components/AvatarFallback';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageAnswers, setMessageAnswers] = useState({});
  const [lockedMessages, setLockedMessages] = useState(new Set());
  const [loadingMessages, setLoadingMessages] = useState(new Set());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading || isSending) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsSending(true);
    setIsLoading(true);
    
    // Reset isSending after a brief moment (user action is complete)
    setTimeout(() => setIsSending(false), 100);

    try {
      // Use the new combined API endpoint with model configuration
      const response = await axios.post(`${API_BASE_URL}/check-and-respond`, {
        prompt: userMessage.content
      });

      if (response.data.needsClarification) {
        const clarifyingMessage = {
          id: Date.now() + 1,
          type: 'assistant-clarifying',
          content: response.data.message,
          questions: response.data.questions,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, clarifyingMessage]);
      } else {
        const answerMessage = {
          id: Date.now() + 1,
          type: 'assistant-answer',
          content: response.data.answer,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, answerMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Show error message to user
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant-answer',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  };

  const handleAnswerChange = (messageId, questionIndex, value) => {
    setMessageAnswers(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [questionIndex]: value
      }
    }));
  };

  const handleSubmitAnswers = async (messageId) => {
    const currentAnswers = messageAnswers[messageId] || {};
    // Check if all fields are empty (treat as skip)
    const hasAnswers = Object.values(currentAnswers).some(answer => answer && answer.trim() !== '');
    
    if (!hasAnswers) {
      // Treat as skip if no answers provided
      handleSkipQuestions(messageId);
      return;
    }

    // Lock the message and set loading state for this specific message
    setLockedMessages(prev => new Set([...prev, messageId]));
    setLoadingMessages(prev => new Set([...prev, messageId]));
    
    try {
      // Find the clarifying message to get its index
      const clarifyingMessageIndex = messages.findIndex(msg => msg.id === messageId);
      if (clarifyingMessageIndex === -1) {
        throw new Error('Clarifying message not found');
      }
      
      // Find the user message that comes before this clarifying message
      const userMessage = messages.slice(0, clarifyingMessageIndex)
        .reverse()
        .find(msg => msg.type === 'user');
      
      if (!userMessage) {
        throw new Error('Original user message not found');
      }

      // Generate answer using the new API endpoint with clarifications
      const answerResponse = await axios.post(`${API_BASE_URL}/generate-final`, {
        prompt: userMessage.content,
        clarifications: Object.values(currentAnswers).filter(answer => answer && answer.trim() !== ''),
        skipClarifications: false,
        fromClarificationFlow: true
      });
      
      const answerMessage = {
        id: Date.now(),
        type: 'assistant-answer',
        content: answerResponse.data.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, answerMessage]);
    } catch (error) {
      console.error('Error generating answer:', error);
      
      // Show error message to user
      const errorMessage = {
        id: Date.now(),
        type: 'assistant-answer',
        content: "I'm sorry, I encountered an error generating your personalized answer. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      setIsSending(false);
    }
  };

  const handleSkipQuestions = async (messageId) => {
    // Lock the message and set loading state for this specific message
    setLockedMessages(prev => new Set([...prev, messageId]));
    setLoadingMessages(prev => new Set([...prev, messageId]));
    
    try {
      // Find the clarifying message to get its index
      const clarifyingMessageIndex = messages.findIndex(msg => msg.id === messageId);
      if (clarifyingMessageIndex === -1) {
        throw new Error('Clarifying message not found');
      }
      
      // Find the user message that comes before this clarifying message
      const userMessage = messages.slice(0, clarifyingMessageIndex)
        .reverse()
        .find(msg => msg.type === 'user');
      
      if (!userMessage) {
        throw new Error('Original user message not found');
      }

      // Generate answer using the new API endpoint without clarifications
      const answerResponse = await axios.post(`${API_BASE_URL}/generate-final`, {
        prompt: userMessage.content,
        skipClarifications: true,
        fromClarificationFlow: true
      });
      
      const answerMessage = {
        id: Date.now(),
        type: 'assistant-answer',
        content: answerResponse.data.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, answerMessage]);
    } catch (error) {
      console.error('Error generating answer:', error);
      
      // Show error message to user
      const errorMessage = {
        id: Date.now(),
        type: 'assistant-answer',
        content: "I'm sorry, I encountered an error generating your answer. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="flex items-start space-x-2 max-w-[80%]">
            <div className="bg-blue-500 text-white rounded-lg px-4 py-2 shadow-sm">
              <p className="text-sm">{message.content}</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <AvatarFallback size={32}>User</AvatarFallback>
            </div>
          </div>
        </div>
      );
    }

    if (message.type === 'assistant-clarifying') {
      const isLocked = lockedMessages.has(message.id);
      const currentAnswers = messageAnswers[message.id] || {};
      const answeredCount = Object.values(currentAnswers).filter(answer => answer && answer.trim() !== '').length;
      const totalQuestions = message.questions.length;
      
      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="flex items-start space-x-2 max-w-[80%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <AvatarFallback size={32}>Assistant</AvatarFallback>
            </div>
            <Card className={`${isLocked ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 mb-4">{message.content}</p>
                
                <div className="space-y-3">
                  {message.questions.map((question, index) => (
                    <div key={index} className="space-y-1">
                      <label className={`text-sm font-medium ${isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
                        {index + 1}. {question}
                      </label>
                      <Textarea
                        value={currentAnswers[index] || ''}
                        onChange={(e) => handleAnswerChange(message.id, index, e.target.value)}
                        placeholder="Your answer"
                        className={`min-h-[40px] resize-none text-sm ${
                          isLocked 
                            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                            : ''
                        }`}
                        disabled={isLocked}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {isLocked ? (
                    <div className="flex items-center text-sm text-gray-500">
                      {answeredCount > 0 ? (
                        <span>✓ {answeredCount}/{totalQuestions} answered</span>
                      ) : (
                        <span>✓ Skipped</span>
                      )}
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleSubmitAnswers(message.id)}
                        disabled={loadingMessages.has(message.id)}
                        size="sm"
                      >
                        {loadingMessages.has(message.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Add Context
                      </Button>
                      
                      <Button
                        onClick={() => handleSkipQuestions(message.id)}
                        disabled={loadingMessages.has(message.id)}
                        variant="outline"
                        size="sm"
                      >
                        Skip & Continue
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (message.type === 'assistant-answer') {
      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="flex items-start space-x-2 max-w-[80%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <AvatarFallback size={32}>Assistant</AvatarFallback>
            </div>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.content}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4" style={{ minHeight: '100vh' }}>
      {/* Full viewport background to prevent white space on scroll */}
      <div className="fixed inset-0 bg-gray-50 dark:bg-slate-900 -z-10"></div>
      
      <div className="w-full max-w-4xl relative h-[85vh]">
        {/* Gradient blur effect around chat container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl blur-md scale-105"></div>
        
        {/* Chat Container */}
                <Card className="relative h-full flex flex-col shadow-2xl border-0 bg-white dark:bg-slate-900 rounded-2xl">
            {/* Messages Area - Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <div className="w-12 h-12 mx-auto mb-4">
                    <AvatarFallback size={48}>Assistant</AvatarFallback>
                  </div>
                  <p>Drop your question. I'll help you think it through.</p>
                </div>
              ) : (
                messages.map(renderMessage)
              )}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <AvatarFallback size={32}>Assistant</AvatarFallback>
                    </div>
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed Footer with Fade Effect */}
            <div className="relative p-4 flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-b-2xl">
              {/* Fade effect overlay */}
              <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-white dark:to-slate-900 pointer-events-none"></div>
              <div className="relative">
              <Textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Start typing..."
                className="w-full min-h-[40px] resize-none p-3"
                disabled={isLoading}
              />
                <Button
                  variant="default"
                  size="icon"
                  aria-label="Submit"
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isSending}
                  className="absolute bottom-2 right-2 h-8 w-8"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
    </div>
  );
}

export default App;