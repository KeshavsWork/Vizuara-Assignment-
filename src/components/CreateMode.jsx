import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Enhanced emotion detection with keyword analysis
const emotionKeywords = {
  happy: {
    words: ['love', 'awesome', 'amazing', 'great', 'fantastic', 'wonderful', 'excited', 'thrilled', 'delighted', 'joyful', 'cheerful', 'glad', 'pleased', 'ecstatic', 'overjoyed'],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400'
  },
  sad: {
    words: ['sad', 'upset', 'disappointed', 'heartbroken', 'depressed', 'miserable', 'down', 'blue', 'gloomy', 'unhappy', 'sorrowful', 'melancholy', 'devastated'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400'
  },
  angry: {
    words: ['angry', 'mad', 'furious', 'rage', 'hate', 'annoyed', 'irritated', 'frustrated', 'outraged', 'livid', 'fuming', 'enraged', 'irate'],
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400'
  },
  fear: {
    words: ['scared', 'afraid', 'terrified', 'frightened', 'nervous', 'anxious', 'worried', 'panicked', 'horrified', 'petrified', 'alarmed', 'apprehensive'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400'
  },
  surprise: {
    words: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'bewildered', 'startled', 'unexpected', 'sudden', 'wow', 'whoa', 'unbelievable'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400'
  }
};

const detectEmotion = (text) => {
  const lowerText = text.toLowerCase();
  const results = {};
  let totalMatches = 0;
  
  // Check for negation
  const negationWords = ['not', 'never', 'no', "don't", "won't", "can't", "isn't", "aren't", "wasn't", "weren't"];
  const hasNegation = negationWords.some(word => lowerText.includes(word));
  
  // Count matches for each emotion
  Object.entries(emotionKeywords).forEach(([emotion, data]) => {
    const matches = data.words.filter(word => lowerText.includes(word));
    if (matches.length > 0) {
      results[emotion] = {
        matches,
        count: matches.length,
        confidence: matches.length / data.words.length
      };
      totalMatches += matches.length;
    }
  });
  
  // Handle negation logic
  if (hasNegation && Object.keys(results).length > 0) {
    const primaryEmotion = Object.entries(results).sort(([,a], [,b]) => b.count - a.count)[0][0];
    if (primaryEmotion === 'fear' || primaryEmotion === 'sad') {
      return {
        emotion: 'happy',
        confidence: 0.8,
        explanation: `The word "not" flipped the emotion from ${primaryEmotion} to happiness (relief)!`,
        keywords: results[primaryEmotion].matches,
        hasNegation: true
      };
    }
  }
  
  if (totalMatches === 0) {
    return {
      emotion: 'neutral',
      confidence: 0,
      explanation: 'No clear emotion detected. Try adding words that show feelings!',
      keywords: [],
      hasNegation: false
    };
  }
  
  // Find dominant emotion
  const dominant = Object.entries(results).sort(([,a], [,b]) => b.count - a.count)[0];
  const [emotion, data] = dominant;
  
  return {
    emotion,
    confidence: Math.min(data.confidence * 2 + 0.3, 1),
    explanation: generateExplanation(emotion, data.matches, hasNegation),
    keywords: data.matches,
    hasNegation
  };
};

const generateExplanation = (emotion, keywords, hasNegation) => {
  const explanations = {
    happy: `I detected happiness from words like "${keywords.join('", "')}"! These words show positive feelings.`,
    sad: `I found sadness in words like "${keywords.join('", "')}"! These words express disappointment or sorrow.`,
    angry: `I sensed anger from words like "${keywords.join('", "')}"! These words show frustration or rage.`,
    fear: `I detected fear in words like "${keywords.join('", "')}"! These words express worry or being scared.`,
    surprise: `I found surprise from words like "${keywords.join('", "')}"! These words show unexpected feelings.`
  };
  
  return explanations[emotion] || 'Interesting sentence! Keep experimenting with emotion words.';
};

const CreateMode = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [savedSentences, setSavedSentences] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef(null);

  // Real-time analysis with debounce
  useEffect(() => {
    if (!inputText.trim()) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const result = detectEmotion(inputText);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleSave = () => {
    if (inputText.trim() && analysis && analysis.emotion !== 'neutral') {
      const newSentence = {
        id: Date.now(),
        text: inputText.trim(),
        emotion: analysis.emotion,
        confidence: analysis.confidence,
        timestamp: new Date().toLocaleTimeString()
      };
      setSavedSentences(prev => [newSentence, ...prev].slice(0, 10)); // Keep last 10
    }
  };

  const highlightKeywords = (text) => {
    if (!analysis || !analysis.keywords.length) return text;
    
    let highlightedText = text;
    const emotion = analysis.emotion === 'neutral' ? 'happy' : analysis.emotion;
    const colors = emotionKeywords[emotion];
    
    analysis.keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<mark class="px-1 py-0.5 rounded ${colors?.bgColor || 'bg-gray-100'} ${colors?.color || 'text-gray-800'} font-semibold">$1</mark>`
      );
    });
    
    return highlightedText;
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😡',
      fear: '😨',
      surprise: '😲',
      neutral: '🤔'
    };
    return emojis[emotion] || '🤔';
  };

  const samplePrompts = [
    "I can't believe I won the lottery!",
    "My best friend is moving to another country...",
    "That spider in my room terrified me!",
    "I'm so mad that someone ate my lunch!",
    "I love spending time with my family."
  ];

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-4 sm:p-6 relative overflow-hidden">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-all"
        >
          ← Back
        </motion.button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            🎨 Create Mode
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Write your own emotional sentences!
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSaved(!showSaved)}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-all"
        >
          📝 Saved ({savedSentences.length})
        </motion.button>
      </motion.div>

      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          
          {/* Tom's Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0"
              >
                T
              </motion.div>
              <div className="flex-1">
                <div className="text-red-400 font-bold mb-2">Tom</div>
                <p className="text-white text-sm sm:text-base">
                  Hey there, emotion creator! Write a sentence about how someone might feel, and I'll help Jerry analyze it!
                </p>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
            <label className="block text-gray-700 font-bold mb-3 text-sm sm:text-base">
              ✍️ Write your emotional sentence:
            </label>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type something like 'I was so excited when I saw the surprise!' or 'The thunderstorm made me feel scared...'"
              className="w-full h-32 sm:h-40 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-400 focus:outline-none text-gray-800 text-sm sm:text-base leading-relaxed"
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-500 text-xs sm:text-sm">
                {inputText.length}/200 characters
              </span>
              {inputText.trim() && analysis && analysis.emotion !== 'neutral' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-all"
                >
                  💾 Save
                </motion.button>
              )}
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <h4 className="text-white font-bold mb-3 text-sm sm:text-base">💡 Try these examples:</h4>
            <div className="space-y-2">
              {samplePrompts.slice(0, 3).map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputText(prompt)}
                  className="w-full text-left p-3 bg-white/10 rounded-lg text-white/90 text-xs sm:text-sm hover:bg-white/20 transition-all border border-white/10"
                >
                  "{prompt}"
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          
          {/* Jerry's Analysis */}
          <AnimatePresence mode="wait">
            {!inputText.trim() ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  J
                </div>
                <div className="text-blue-400 font-bold mb-2">Jerry</div>
                <p className="text-white/80 text-sm sm:text-base">
                  Start typing a sentence and I'll analyze the emotions for you! 🔍
                </p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-spin">
                  🔍
                </div>
                <div className="text-blue-400 font-bold mb-2">Jerry</div>
                <p className="text-white/80 text-sm sm:text-base">
                  Analyzing emotions... 🤔
                </p>
              </motion.div>
            ) : analysis && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                    J
                  </div>
                  <div className="flex-1">
                    <div className="text-blue-600 font-bold mb-2">Jerry's Analysis</div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl sm:text-4xl">{getEmotionEmoji(analysis.emotion)}</span>
                      <div>
                        <div className="font-bold text-lg sm:text-xl text-gray-800 capitalize">
                          {analysis.emotion === 'neutral' ? 'No Clear Emotion' : analysis.emotion}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Confidence: {Math.round(analysis.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-gray-700 mb-2 text-sm sm:text-base">📝 Your sentence with keywords highlighted:</h4>
                  <p 
                    className="text-gray-800 text-sm sm:text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(inputText) }}
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-blue-700 mb-2 text-sm sm:text-base">🧠 Why I think this:</h4>
                  <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                    {analysis.explanation}
                  </p>
                </div>

                {analysis.hasNegation && (
                  <div className="bg-purple-50 rounded-xl p-4 mt-4">
                    <h4 className="font-bold text-purple-700 mb-2 text-sm">🔄 Negation Detected!</h4>
                    <p className="text-purple-800 text-xs sm:text-sm">
                      I found words like "not" or "never" that can flip emotions around!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confidence Meter */}
          {analysis && analysis.emotion !== 'neutral' && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <h4 className="text-white font-bold mb-3 text-sm sm:text-base">📊 Confidence Meter</h4>
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    analysis.confidence >= 0.8 ? 'bg-green-400' :
                    analysis.confidence >= 0.6 ? 'bg-yellow-400' :
                    'bg-orange-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.confidence * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-white/80 text-xs sm:text-sm mt-2">
                {analysis.confidence >= 0.8 ? '🎯 Very confident!' :
                 analysis.confidence >= 0.6 ? '👍 Pretty sure!' :
                 '🤔 Could be stronger - try more emotion words!'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Saved Sentences Modal */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSaved(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-auto"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">💾 Saved Sentences</h3>
              {savedSentences.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No saved sentences yet. Create some emotional sentences first!</p>
              ) : (
                <div className="space-y-3">
                  {savedSentences.map((sentence) => (
                    <div key={sentence.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getEmotionEmoji(sentence.emotion)}</span>
                        <span className="font-bold text-sm capitalize text-gray-700">{sentence.emotion}</span>
                        <span className="text-xs text-gray-500 ml-auto">{sentence.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800">{sentence.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateMode;
