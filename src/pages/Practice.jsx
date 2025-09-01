import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Practice questions data
const practiceQuestions = [
  {
    id: 1,
    title: "The Mystery Box",
    scenario: "You receive a gift box on a normal day with no special occasion. You have no idea what's inside! What do you feel as you start to open it?",
    options: [
      { letter: 'a', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'b', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'c', emotion: 'surprise', label: 'Surprise', emoji: '😲' },
      { letter: 'd', emotion: 'fear', label: 'Fear', emoji: '😨' }
    ],
    correct: 'surprise',
    explanation: "Getting an unexpected gift makes you feel surprised! You didn't expect it and don't know what's inside."
  },
  {
    id: 2,
    title: "The Winning Goal",
    scenario: "Imagine you are playing football. In the last minute of the game, you score the winning goal! Your teammates are cheering your name. How do you feel?",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'c', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'd', emotion: 'fear', label: 'Fear', emoji: '😨' }
    ],
    correct: 'happy',
    explanation: "Scoring the winning goal and hearing cheers makes you feel happy and proud!"
  },
  {
    id: 3,
    title: "The Cancelled Trip",
    scenario: "You have been excited for weeks about the school trip to the local science museum. On the morning of the trip, the school announces it has been cancelled. What is your main feeling?",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'c', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'd', emotion: 'surprise', label: 'Surprise', emoji: '😲' }
    ],
    correct: 'sad',
    explanation: "When something you were looking forward to gets cancelled, it makes you feel sad and disappointed."
  },
  {
    id: 4,
    title: "The Dark Room",
    scenario: "You walk into a dark room and suddenly hear a loud, unexpected noise behind you. What is the first emotion that you feel?",
    options: [
      { letter: 'a', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'b', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'c', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'd', emotion: 'sad', label: 'Sad', emoji: '😢' }
    ],
    correct: 'fear',
    explanation: "Sudden loud noises in dark places make you feel scared or afraid - that's fear!"
  },
  {
    id: 5,
    title: "The Broken Crayon",
    scenario: "You are drawing your best artwork yet. Your friend borrows your favorite color crayon and accidentally breaks it in half. How might you feel towards your friend?",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'c', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'd', emotion: 'surprise', label: 'Surprise', emoji: '😲' }
    ],
    correct: 'angry',
    explanation: "When someone breaks something important to you, even by accident, it can make you feel angry or upset."
  },
  {
    id: 6,
    title: "The Unexpected Holiday",
    scenario: "Your principal announces over the school speaker that tomorrow will be a holiday because of heavy rain. You were not expecting that at all! What is your first reaction?",
    options: [
      { letter: 'a', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'b', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'c', emotion: 'surprise', label: 'Surprise', emoji: '😲' },
      { letter: 'd', emotion: 'angry', label: 'Angry', emoji: '😡' }
    ],
    correct: 'surprise',
    explanation: "An unexpected announcement that you didn't see coming makes you feel surprised!"
  },
  {
    id: 7,
    title: "A Scoop of Joy",
    scenario: "Your mom buys you your favorite flavor of ice cream after a long, hot day at school. What emotion do you feel while eating it?",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'c', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'd', emotion: 'angry', label: 'Angry', emoji: '😡' }
    ],
    correct: 'happy',
    explanation: "Getting your favorite ice cream on a hot day makes you feel happy and refreshed!"
  },
  {
    id: 8,
    title: "The Lost Pet",
    scenario: "You come home from school and find out that your pet cat, whom you love very much, has gone missing. What is the strongest emotion you feel?",
    options: [
      { letter: 'a', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'b', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'c', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'd', emotion: 'surprise', label: 'Surprise', emoji: '😲' }
    ],
    correct: 'sad',
    explanation: "When someone or something you love goes missing, it makes you feel very sad and worried."
  },
  {
    id: 9,
    title: "The Unfair Turn",
    scenario: "You are playing a board game with friends. Someone takes your turn by mistake and gets ahead in the game. What emotion does this make you feel?",
    options: [
      { letter: 'a', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'b', emotion: 'angry', label: 'Angry', emoji: '😡' },
      { letter: 'c', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'd', emotion: 'sad', label: 'Sad', emoji: '😢' }
    ],
    correct: 'angry',
    explanation: "When something unfair happens in a game, it makes you feel angry or frustrated."
  },
  {
    id: 10,
    title: "The Spooky Shadow",
    scenario: "While walking home in the evening, you see a tall, strange shadow on the wall that seems to be following you. What emotion takes over?",
    options: [
      { letter: 'a', emotion: 'sad', label: 'Sad', emoji: '😢' },
      { letter: 'b', emotion: 'happy', label: 'Happy', emoji: '😊' },
      { letter: 'c', emotion: 'fear', label: 'Fear', emoji: '😨' },
      { letter: 'd', emotion: 'surprise', label: 'Surprise', emoji: '😲' }
    ],
    correct: 'fear',
    explanation: "Strange shadows that seem to follow you make you feel scared - that's fear!"
  }
];

const Practice = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  
  const advanceTimerRef = useRef(null);

  // Safe question derivation
  const total = practiceQuestions.length;
  const question = practiceQuestions[currentQuestion] || null;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // If no question (game finished), show loading state
  if (!question) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm px-8 py-6 rounded-xl text-white text-center">
          <div className="text-2xl font-bold mb-2">🏆 Finishing up...</div>
          <div className="text-lg">Calculating your results!</div>
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
    if (showFeedback || advancing) return; // Prevent multiple selections

    setAdvancing(true);
    setSelectedAnswer(emotion);
    const correct = emotion === question.correct;
    setIsCorrect(correct);
    
    // Update score
    if (correct) {
      setScore(prev => prev + 1);
    }

    // Record answer
    const newAnswer = {
      questionId: question.id,
      selected: emotion,
      correct: question.correct,
      isCorrect: correct
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowFeedback(true);

    // Auto-advance after 5 seconds
    advanceTimerRef.current = setTimeout(() => {
      const nextIndex = currentQuestion + 1;
      if (nextIndex < total) {
        setCurrentQuestion(nextIndex);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setAdvancing(false);
      } else {
        // Game complete - calculate final score
        const finalScore = score + (correct ? 1 : 0);
        const finalAnswers = [...answers, newAnswer];
        onComplete({ 
          score: finalScore, 
          total, 
          answers: finalAnswers 
        });
      }
      advanceTimerRef.current = null;
    }, 5000);
  };

  function handleNext() {
// Clear auto-advance timer if present
if (advanceTimerRef.current) {
clearTimeout(advanceTimerRef.current);
advanceTimerRef.current = null;
}

// Allow manual next even if advancing was set by auto-timer
setAdvancing(false);

const nextIndex = currentQuestion + 1;
if (nextIndex < total) {
setCurrentQuestion(nextIndex);
setSelectedAnswer(null);
setShowFeedback(false);
} else {
onComplete?.({ score, total, answers });
}
}



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
            Practice Mode
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Step 2 of 3 • Question {currentQuestion + 1}/{total}
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
            className="h-full bg-gradient-to-r from-blue-400 to-green-500 rounded-full"
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
              T
            </motion.div>
            <div className="bg-white rounded-2xl rounded-bl-sm p-6 shadow-lg flex-1">
              <div className="text-red-600 font-bold text-lg mb-2">Tom</div>
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
                  Help me figure out what emotion this situation would make you feel! Click your answer below.
                </p>
              ) : (
                <div>
                  <p className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '🎉 Correct!' : '🤔 Not quite right!'}
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

          {/* Next Button (shown during feedback) */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                {currentQuestion < total - 1 ? 'Next Question →' : 'See Results 🏆'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Confetti Effect for Correct Answers */}
      <AnimatePresence>
        {showFeedback && isCorrect && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
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
                  duration: 3,
                  delay: Math.random() * 0.5 
                }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: ['#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#e91e63'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;
