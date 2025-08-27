import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ChatBubble from '../components/Chatbubble';

// Tutorial conversation data
const tutorialConversation = [
  {
    id: 1,
    speaker: "jerry",
    text: "Let me teach you about emotions, Tom!",
    emotion: null,
    delay: 0
  },
  {
    id: 2,
    speaker: "tom", 
    text: "Emotions? Like when I'm SUPER excited? 😊",
    emotion: "happy",
    delay: 1500
  },
  {
    id: 3,
    speaker: "jerry",
    text: "Exactly! That's HAPPY. Words like 'love' and 'awesome' show happiness.",
    emotion: "happy",
    keywords: ["love", "awesome"],
    delay: 3000
  },
  {
    id: 4,
    speaker: "tom",
    text: "What about when I'm MAD at that mouse? 😡",
    emotion: "angry", 
    delay: 4500
  },
  {
    id: 5,
    speaker: "jerry",
    text: "That's ANGRY! Words like 'hate' and 'furious' show anger.",
    emotion: "angry",
    keywords: ["hate", "furious"],
    delay: 6000
  },
  {
    id: 6,
    speaker: "tom",
    text: "Sometimes I feel down when I lose... 😢",
    emotion: "sad",
    delay: 7500
  },
  {
    id: 7,
    speaker: "jerry", 
    text: "That's SAD. Words like 'upset' and 'disappointed' show sadness.",
    emotion: "sad",
    keywords: ["upset", "disappointed"],
    delay: 9000
  },
  {
    id: 8,
    speaker: "tom",
    text: "And when loud noises startle me? 😨",
    emotion: "fear",
    delay: 10500
  },
  {
    id: 9,
    speaker: "jerry",
    text: "That's FEAR! Words like 'scared' and 'afraid' show fear.",
    emotion: "fear", 
    keywords: ["scared", "afraid"],
    delay: 12000
  },
  {
    id: 10,
    speaker: "tom",
    text: "OH WOW! I didn't expect that! 😲",
    emotion: "surprise",
    delay: 13500
  },
  {
    id: 11,
    speaker: "jerry",
    text: "Perfect example of SURPRISE! Words like 'shocked' and 'unexpected'.",
    emotion: "surprise",
    keywords: ["shocked", "unexpected"], 
    delay: 15000
  }
];

const Tutorial = ({ onContinue, onBack }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [visibleMessages]);

  // Main tutorial animation effect
  useEffect(() => {
    const timers = [];
    
    // Allow skipping after 2 seconds
    timers.push(setTimeout(() => setCanSkip(true), 2000));

    // Stage each message
    tutorialConversation.forEach((msg, idx) => {
      timers.push(setTimeout(() => {
        setVisibleMessages(prev => {
          if (prev.some(x => x.id === msg.id)) return prev;
          return [...prev, msg];
        });
        
        // Update progress
        setCurrentProgress(idx + 1);
        
        // Show continue button after last message
        if (idx === tutorialConversation.length - 1) {
          timers.push(setTimeout(() => {
            setShowContinueButton(true);
          }, 1000));
        }
      }, msg.delay));
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const handleSkip = () => {
    if (!canSkip) return;
    
    // Show all messages immediately
    setVisibleMessages(tutorialConversation);
    setCurrentProgress(tutorialConversation.length);
    setShowContinueButton(true);
  };

  const handleContinue = () => {
    onContinue();
  };

  // Keyword highlighting function
  const highlightKeywords = (text, keywords, emotion) => {
    if (!keywords || !emotion) return text;
    
    let highlightedText = text;
    const emotionColors = {
      happy: 'bg-green-200 text-green-800',
      angry: 'bg-red-200 text-red-800', 
      sad: 'bg-blue-200 text-blue-800',
      fear: 'bg-purple-200 text-purple-800',
      surprise: 'bg-orange-200 text-orange-800'
    };
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="px-2 py-1 rounded-md font-bold ${emotionColors[emotion]}">$1</span>`
      );
    });
    
    return highlightedText;
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-6 relative overflow-hidden">
      
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
            Learning About Emotions
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Step 1 of 3 • {currentProgress}/{tutorialConversation.length}
          </p>
        </div>

        {canSkip && !showContinueButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-all"
          >
            Skip →
          </motion.button>
        )}
        
        {!canSkip && (
          <div className="w-20"></div> // Spacer
        )}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="w-full max-w-md mx-auto mb-8 z-10"
      >
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentProgress / tutorialConversation.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Conversation Section */}
      <div className="flex-1 w-full max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 h-full"
        >
          <div 
            ref={chatRef}
            className="h-96 overflow-y-auto space-y-4 scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
          >
            {visibleMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`flex items-start gap-4 ${message.speaker === 'jerry' ? 'flex-row-reverse' : ''}`}
              >
                {/* Character Avatar */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ${
                    message.speaker === 'jerry' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-red-500 to-red-600'
                  }`}
                >
                  {message.speaker === 'jerry' ? 'J' : 'T'}
                </motion.div>

                {/* Chat Bubble with Keyword Highlighting */}
                <div className={`max-w-md px-6 py-4 bg-white rounded-2xl shadow-lg ${
                  message.speaker === 'jerry' ? 'rounded-br-sm' : 'rounded-bl-sm'
                }`}>
                  <div className={`text-sm font-bold mb-2 ${
                    message.speaker === 'jerry' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {message.speaker === 'jerry' ? 'Jerry' : 'Tom'}
                  </div>
                  <p 
                    className="text-gray-800 text-base leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywords(message.text, message.keywords, message.emotion)
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <AnimatePresence>
        {showContinueButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mt-8 text-center z-10"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="px-8 py-4 text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-2xl transition-all duration-300"
            >
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-3"
              >
                Got it! Let's Practice 🎯
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator when tutorial is running */}
      {!showContinueButton && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-6 right-6 w-6 h-6 border-2 border-white border-t-transparent rounded-full"
        />
      )}
    </div>
  );
};

export default Tutorial;
