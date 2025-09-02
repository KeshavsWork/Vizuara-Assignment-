import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Expanded emotion keywords with more comprehensive detection
const emotionKeywords = {
  happy: {
    words: [
      // Direct happiness
      'happy', 'joy', 'joyful', 'cheerful', 'glad', 'pleased', 'delighted', 'thrilled', 'excited', 'ecstatic', 'overjoyed', 'elated',
      // Positive actions/feelings
      'love', 'awesome', 'amazing', 'great', 'fantastic', 'wonderful', 'brilliant', 'perfect', 'excellent', 'incredible', 'marvelous',
      // Positive expressions
      'smile', 'laugh', 'giggle', 'celebrate', 'party', 'win', 'success', 'victory', 'achieve', 'accomplish', 'proud',
      // Colloquial happiness
      'yay', 'hooray', 'woohoo', 'yes', 'sweet', 'cool', 'nice', 'good', 'best', 'favorite', 'enjoy', 'fun'
    ],
    intensifiers: ['very', 'so', 'extremely', 'super', 'really', 'absolutely', 'totally'],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400'
  },
  sad: {
    words: [
      // Direct sadness
      'sad', 'unhappy', 'depressed', 'miserable', 'gloomy', 'down', 'blue', 'melancholy', 'sorrowful', 'heartbroken', 'devastated',
      // Disappointment
      'disappointed', 'upset', 'let down', 'discouraged', 'dismayed', 'crushed', 'defeated', 'hopeless',
      // Loss/grief
      'cry', 'tears', 'weep', 'sob', 'mourn', 'grieve', 'miss', 'lost', 'gone', 'left', 'alone', 'lonely',
      // Negative situations
      'failed', 'fail', 'broke', 'broken', 'hurt', 'pain', 'ache', 'suffer', 'struggle', 'difficult', 'hard', 'tough'
    ],
    intensifiers: ['very', 'so', 'extremely', 'really', 'deeply', 'completely'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400'
  },
  angry: {
    words: [
      // Direct anger
      'angry', 'mad', 'furious', 'rage', 'enraged', 'livid', 'fuming', 'irate', 'outraged', 'incensed',
      // Irritation
      'annoyed', 'irritated', 'frustrated', 'aggravated', 'bothered', 'irked', 'vexed', 'pissed',
      // Hate/dislike
      'hate', 'despise', 'loathe', 'detest', 'can\'t stand', 'disgusted', 'sick of', 'fed up',
      // Aggressive actions
      'fight', 'argue', 'yell', 'shout', 'scream', 'storm', 'slam', 'punch', 'hit', 'attack',
      // Unfairness
      'unfair', 'wrong', 'stupid', 'ridiculous', 'absurd', 'outrageous', 'unacceptable'
    ],
    intensifiers: ['very', 'so', 'extremely', 'really', 'absolutely', 'completely'],
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400'
  },
  fear: {
    words: [
      // Direct fear
      'scared', 'afraid', 'frightened', 'terrified', 'petrified', 'horrified', 'panicked', 'fearful',
      // Anxiety/worry
      'nervous', 'anxious', 'worried', 'concerned', 'apprehensive', 'uneasy', 'tense', 'stressed',
      // Scary things
      'creepy', 'spooky', 'eerie', 'haunted', 'ghost', 'monster', 'dark', 'shadow', 'nightmare',
      // Physical reactions
      'shake', 'shaking', 'tremble', 'trembling', 'sweat', 'heart racing', 'jump', 'startled',
      // Danger
      'dangerous', 'threat', 'risk', 'unsafe', 'warning', 'alarm', 'emergency', 'help'
    ],
    intensifiers: ['very', 'so', 'extremely', 'really', 'absolutely', 'completely'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400'
  },
  surprise: {
    words: [
      // Direct surprise
      'surprised', 'shocked', 'amazed', 'astonished', 'astounded', 'stunned', 'bewildered', 'dumbfounded',
      // Unexpected
      'unexpected', 'sudden', 'suddenly', 'all of a sudden', 'out of nowhere', 'didn\'t see coming', 'caught off guard',
      // Expressions
      'wow', 'whoa', 'oh my', 'no way', 'really', 'seriously', 'unbelievable', 'incredible', 'can\'t believe',
      // Discovery
      'found', 'discovered', 'revealed', 'appeared', 'showed up', 'turned out', 'realized', 'noticed'
    ],
    intensifiers: ['very', 'so', 'extremely', 'really', 'absolutely', 'completely'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400'
  }
};

// Enhanced emotion detection with better algorithms
const detectEmotion = (text) => {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Advanced negation detection
  const negationWords = ['not', 'never', 'no', "don't", "won't", "can't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "wouldn't", "shouldn't", "couldn't"];
  const negationPattern = new RegExp(`\\b(${negationWords.join('|')})\\b`, 'gi');
  const negationMatches = lowerText.match(negationPattern);
  
  const results = {};
  let totalMatches = 0;
  let maxScore = 0;
  let dominantEmotion = 'neutral';
  
  // Enhanced scoring system
  Object.entries(emotionKeywords).forEach(([emotion, data]) => {
    let score = 0;
    let matches = [];
    
    // Check main keywords
    data.words.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const wordMatches = lowerText.match(regex);
      if (wordMatches) {
        matches.push(...wordMatches);
        score += wordMatches.length;
      }
    });
    
    // Check for intensifiers near emotion words
    if (matches.length > 0) {
      data.intensifiers.forEach(intensifier => {
        const intensifierRegex = new RegExp(`\\b${intensifier}\\s+\\w*\\s*(${data.words.join('|')})`, 'gi');
        if (intensifierRegex.test(lowerText)) {
          score += 0.5; // Bonus for intensified emotions
        }
      });
    }
    
    if (score > 0) {
      results[emotion] = {
        matches: [...new Set(matches)], // Remove duplicates
        score,
        confidence: Math.min(score / 3, 1) // Normalize confidence
      };
      totalMatches += score;
      
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }
  });
  
  // Handle complex negation scenarios
  if (negationMatches && negationMatches.length > 0 && totalMatches > 0) {
    const negationLogic = handleNegation(dominantEmotion, lowerText, results);
    if (negationLogic.flipped) {
      return {
        emotion: negationLogic.newEmotion,
        confidence: Math.min(negationLogic.confidence, 0.9),
        explanation: negationLogic.explanation,
        keywords: results[dominantEmotion]?.matches || [],
        hasNegation: true,
        originalEmotion: dominantEmotion
      };
    }
  }
  
  // No clear emotion detected
  if (totalMatches === 0) {
    // Try to detect subtle emotional cues
    const subtleEmotion = detectSubtleEmotions(lowerText);
    if (subtleEmotion.emotion !== 'neutral') {
      return subtleEmotion;
    }
    
    return {
      emotion: 'neutral',
      confidence: 0,
      explanation: 'No clear emotion detected. Try adding more descriptive feeling words like "happy", "sad", "angry", "scared", or "surprised"!',
      keywords: [],
      hasNegation: false,
      suggestions: getSuggestions(lowerText)
    };
  }
  
  return {
    emotion: dominantEmotion,
    confidence: Math.min(results[dominantEmotion].confidence + 0.2, 1),
    explanation: generateExplanation(dominantEmotion, results[dominantEmotion].matches, false),
    keywords: results[dominantEmotion].matches,
    hasNegation: false
  };
};

// Handle negation logic
const handleNegation = (emotion, text, results) => {
  const negationRules = {
    fear: { flipsTo: 'happy', reason: 'relief' },
    sad: { flipsTo: 'happy', reason: 'relief' },
    angry: { flipsTo: 'happy', reason: 'relief' },
    happy: { flipsTo: 'sad', reason: 'disappointment' },
    surprise: { flipsTo: 'neutral', reason: 'expectation' }
  };
  
  const rule = negationRules[emotion];
  if (!rule) return { flipped: false };
  
  return {
    flipped: true,
    newEmotion: rule.flipsTo,
    confidence: 0.8,
    explanation: `The word "not" flipped the emotion from ${emotion} to ${rule.flipsTo} (${rule.reason})! Negation words can completely change the meaning.`
  };
};

// Detect subtle emotional cues
const detectSubtleEmotions = (text) => {
  // Punctuation-based detection
  if (text.includes('!!!') || text.includes('!!!!')) {
    if (text.includes('?')) {
      return {
        emotion: 'surprise',
        confidence: 0.6,
        explanation: 'Multiple exclamation marks with questions often show surprise or confusion!',
        keywords: ['!!!', '?'],
        hasNegation: false
      };
    }
    return {
      emotion: 'happy',
      confidence: 0.7,
      explanation: 'Multiple exclamation marks usually show excitement or strong positive emotion!',
      keywords: ['!!!'],
      hasNegation: false
    };
  }
  
  // Question-based surprise detection
  if (text.match(/what\?|how\?|why\?|really\?|seriously\?/)) {
    return {
      emotion: 'surprise',
      confidence: 0.6,
      explanation: 'Questions with surprise words like "what?" or "really?" often show amazement!',
      keywords: text.match(/what\?|how\?|why\?|really\?|seriously\?/) || [],
      hasNegation: false
    };
  }
  
  // Contextual detection
  const contexts = {
    birthday: 'happy',
    party: 'happy',
    vacation: 'happy',
    test: 'fear',
    exam: 'fear',
    homework: 'sad',
    hospital: 'fear',
    doctor: 'fear',
    dentist: 'fear',
    thunder: 'fear',
    lightning: 'fear',
    spider: 'fear',
    snake: 'fear'
  };
  
  for (const [context, emotion] of Object.entries(contexts)) {
    if (text.includes(context)) {
      return {
        emotion,
        confidence: 0.5,
        explanation: `The word "${context}" often relates to ${emotion} emotions. Context clues help detect feelings!`,
        keywords: [context],
        hasNegation: false,
        isContextual: true
      };
    }
  }
  
  return { emotion: 'neutral', confidence: 0 };
};

// Generate suggestions for improvement
const getSuggestions = (text) => {
  const suggestions = [];
  
  if (text.length < 10) {
    suggestions.push("Try writing a longer sentence with more details!");
  }
  
  if (!text.match(/[.!?]/)) {
    suggestions.push("Add some punctuation like ! or ? to show emotion!");
  }
  
  suggestions.push("Try words like: excited, disappointed, frustrated, amazed, or worried");
  
  return suggestions;
};

// Enhanced explanation generator
const generateExplanation = (emotion, keywords, hasNegation) => {
  const keywordList = keywords.slice(0, 3).join('", "'); // Limit to 3 keywords
  
  const explanations = {
    happy: `I detected happiness from words like "${keywordList}"! These words express joy, excitement, or positive feelings.`,
    sad: `I found sadness in words like "${keywordList}"! These words show disappointment, sorrow, or negative feelings.`,
    angry: `I sensed anger from words like "${keywordList}"! These words express frustration, rage, or being upset.`,
    fear: `I detected fear in words like "${keywordList}"! These words show worry, anxiety, or being scared.`,
    surprise: `I found surprise from words like "${keywordList}"! These words show unexpected events or amazement.`
  };
  
  let explanation = explanations[emotion] || 'Interesting sentence! Keep experimenting with emotion words.';
  
  if (keywords.length > 3) {
    explanation += ` I also found other emotion words that strengthen this feeling!`;
  }
  
  return explanation;
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
  // Clear emotions
  "I can't believe I won the lottery!",
  "My best friend is moving to another country and I'm heartbroken.",
  "That huge spider in my room absolutely terrified me!",
  "I'm so frustrated that someone ate my lunch again!",
  "I love spending cozy evenings with my family.",
  
  // Subtle emotions  
  "The test results come out tomorrow...",
  "My birthday party is next week!!!",
  "What? You're telling me school is canceled?",
  "I'm not worried about the presentation anymore.",
  "The thunder is so loud outside right now.",
  
  // Complex scenarios
  "I failed my driving test but I'll try again next month.",
  "Wow, I never expected to see you here!",
  "I'm not afraid of the dark like I used to be.",
  "This homework is absolutely impossible to finish.",
  "My dog has been missing for three days now."
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
