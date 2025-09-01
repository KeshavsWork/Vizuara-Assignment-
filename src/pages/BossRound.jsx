import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Harder boss questions with negation and mixed emotions
const bossQuestions = [
  {
    id: 1,
    title: "The Relief Moment",
    scenario: "You were worried about a test result all week. The teacher finally tells you that you passed with flying colors. You're NOT scared anymore!",
    options: [
      { letter: 'a', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'b', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'c', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'd', emotion: 'angry', label: 'Angry', emoji: '😡' }
    ],
    correct: 'happy',
    explanation: "When you're 'NOT scared anymore' after good news, you feel relief and happiness! The negation flipped from fear to joy."
  },
  {
    id: 2,
    title: "Mixed Birthday Emotions",
    scenario: "It's your birthday party, but your best friend couldn't come because they're sick. You're happy about the party but also disappointed about your friend.",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'c', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'd', emotion: 'surprise', label: 'Surprise', emoji: '😲' }
    ],
    correct: 'sad',
    explanation: "Even though there's happiness, the disappointment about your best friend not being there is the stronger emotion that stands out."
  },
  {
    id: 3,
    title: "The Brave Moment",
    scenario: "You had to give a speech in front of the whole school. Afterwards, you realize you're NOT afraid of public speaking like you thought you were!",
    options: [
      { letter: 'a', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'b', emotion: 'surprise', label: 'Surprise', emoji: '😲' },
      { letter: 'c', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'd', emotion: 'angry', label: 'Angry', emoji: '😡' }
    ],
    correct: 'surprise',
    explanation: "Discovering you're 'NOT afraid' when you expected to be creates surprise - you didn't expect this about yourself!"
  },
  {
    id: 4,
    title: "The Tricky Gift",
    scenario: "Someone gives you a present, but when you open it, it's something you already have three of. You try to smile and say thank you.",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'c', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'd', emotion: 'surprise', label: 'Surprise', emoji: '😲' }
    ],
    correct: 'sad',
    explanation: "Even though you're being polite, receiving something you don't need makes you feel disappointed or sad inside."
  },
  {
    id: 5,
    title: "The Unexpected Win",
    scenario: "You entered a contest you forgot about months ago. Suddenly, you get a call saying you WON first prize - a trip to your dream destination!",
    options: [
      { letter: 'a', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'b', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'c', emotion: 'surprise', label: 'Surprise', emoji: '😲' },
      { letter: 'd', emotion: 'angry', label: 'Angry', emoji: '😡' }
    ],
    correct: 'surprise',
    explanation: "Completely unexpected good news creates surprise first - you're shocked because you forgot you even entered!"
  }
];

const BossRound = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  
  const advanceTimerRef = useRef(null);

  const total = bossQuestions.length;
  const question = bossQuestions[currentQuestion] || null;

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  if (!question) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm px-8 py-6 rounded-xl text-white text-center">
          <div className="text-2xl font-bold mb-2">👑 Finishing Boss Round...</div>
          <div className="text-lg">Calculating your mastery level!</div>
        </div>
      </div>
    );
  }

  const emotionColors = {
    happy: { bg: 'bg-green-100 hover:bg-green-200', border: 'border-green-400', text: 'text-green-700' },
    sad: { bg: 'bg-blue-100 hover:bg-blue-200', border: 'border-blue-400', text: 'text-blue-700' },
    angry: { bg: 'bg-red-100 hover:bg-red-200', border: 'border-red-400', text: 'text-red-700' },
    fear: { bg: 'bg-purple-100 hover:bg-purple-200', border: 'border-purple-400', text: 'text-purple-700' },
    surprise: { bg: 'bg-orange-100 hover:bg-orange-200', border: 'border-orange-400', text: 'text-orange-700' }
  };

  const handleAnswerSelect = (emotion) => {
    if (showFeedback || advancing) return;

    setSelectedAnswer(emotion);
    const correct = emotion === question.correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    const newAnswer = {
      questionId: question.id,
      selected: emotion,
      correct: question.correct,
      isCorrect: correct
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowFeedback(true);

    advanceTimerRef.current = setTimeout(() => {
      const nextIndex = currentQuestion + 1;
      if (nextIndex < total) {
        setCurrentQuestion(nextIndex);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setAdvancing(false);
      } else {
        const finalScore = score + (correct ? 1 : 0);
        const finalAnswers = [...answers, newAnswer];
        onComplete({ 
          score: finalScore, 
          total, 
          answers: finalAnswers 
        });
      }
      advanceTimerRef.current = null;
    }, 6000); // Slightly longer for harder questions
  };

  const handleNext = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setAdvancing(false);

    const nextIndex = currentQuestion + 1;
    if (nextIndex < total) {
      setCurrentQuestion(nextIndex);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete({ score, total, answers });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col p-6 relative overflow-hidden">
      
      {/* Boss Round Header */}
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
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg flex items-center gap-2">
            👑 Boss Round
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Master Level • Question {currentQuestion + 1}/{total}
          </p>
        </div>

        <div className="text-right">
          <div className="text-white font-bold">Score: {score}/{total}</div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="w-full max-w-md mx-auto mb-8 z-10"
      >
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Question Section */}
      <div className="flex-1 w-full max-w-4xl mx-auto z-10">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20"
        >
          
          {/* Tom's Question */}
          <div className="flex items-start gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0"
            >
              👑
            </motion.div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl rounded-bl-sm p-6 shadow-lg flex-1 border-2 border-yellow-300">
              <div className="text-orange-600 font-bold text-lg mb-2">Boss Challenge</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{question.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{question.scenario}</p>
            </div>
          </div>

          {/* Jerry's Help */}
          <div className="flex items-start gap-4 mb-8 flex-row-reverse">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0"
            >
              J
            </motion.div>
            <div className="bg-white rounded-2xl rounded-br-sm p-6 shadow-lg flex-1">
              <div className="text-blue-600 font-bold text-lg mb-2">Jerry</div>
              {!showFeedback ? (
                <p className="text-gray-700 text-lg">
                  This is a tricky one! Look carefully for clues about mixed emotions or negation words like "NOT". What's the main feeling?
                </p>
              ) : (
                <div>
                  <p className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '🎉 Master Detective!' : '🤔 Almost there!'}
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option) => (
              <motion.button
                key={option.letter}
                whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                onClick={() => handleAnswerSelect(option.emotion)}
                disabled={showFeedback}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 text-left
                  ${emotionColors[option.emotion].bg} ${emotionColors[option.emotion].border}
                  ${showFeedback && selectedAnswer === option.emotion 
                    ? isCorrect 
                      ? 'ring-4 ring-green-400 bg-green-200' 
                      : 'ring-4 ring-red-400 bg-red-200'
                    : ''
                  }
                  ${showFeedback && option.emotion === question.correct && selectedAnswer !== option.emotion
                    ? 'ring-4 ring-green-400 bg-green-200'
                    : ''
                  }
                  ${showFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-lg'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${emotionColors[option.emotion].border} ${emotionColors[option.emotion].text}`}>
                    {option.letter.toUpperCase()}
                  </div>
                  <span className="text-3xl">{option.emoji}</span>
                  <span className={`font-bold text-lg ${emotionColors[option.emotion].text}`}>
                    {option.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Next Button */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center relative z-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
              >
                {currentQuestion < total - 1 ? 'Next Challenge →' : 'See Master Results 👑'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Special Boss Confetti */}
      <AnimatePresence>
        {showFeedback && isCorrect && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  y: -50, 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                  rotate: 0 
                }}
                animate={{ 
                  opacity: 0, 
                  y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 100,
                  rotate: 360 
                }}
                transition={{ 
                  duration: 4,
                  delay: Math.random() * 0.8 
                }}
                className="absolute w-6 h-6 rounded-full"
                style={{
                  backgroundColor: ['#ffd700', '#ffeb3b', '#ff9800', '#e91e63', '#9c27b0'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BossRound;
