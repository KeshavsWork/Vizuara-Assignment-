import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef} from 'react';
import ChatBubble from '../components/Chatbubble';
import { welcomeConversation, emotions } from '../data/Appdata';
import TomImg from '../assets/Tom.jpg';
import JerryImg from "../assets/Jerry.jpg";
const Firstpage = ({ onStartMission }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
const chatRef = useRef(null);

//   useEffect(() => {
//     // Title animation
//     setTimeout(() => setShowTitle(true), 500);
    
//     // Character images
//     setTimeout(() => setShowImages(true), 1000);
    
//     // Start conversation after images appear
//     setTimeout(() => {
//       welcomeConversation.forEach((message, index) => {
//         setTimeout(() => {
//           setVisibleMessages(prev => [...prev, message]);
          
//           // Show button after last message
//           if (index === welcomeConversation.length - 1) {
//             setTimeout(() => {
//               setShowButton(true);
//               setAnimationComplete(true);
//             }, 1000);
//           }
//         }, message.delay);
//       });
//     }, 1500);
//   }, []);
useEffect(() => {
if (!chatRef.current) return;
// Option A: native smooth scroll (most modern browsers)
chatRef.current.scrollTo({
top: chatRef.current.scrollHeight,
behavior: 'smooth'
});
}, [visibleMessages]);


useEffect(() => {
const timers = [];

timers.push(setTimeout(() => setShowTitle(true), 500));
timers.push(setTimeout(() => setShowImages(true), 1000));

timers.push(setTimeout(() => {
welcomeConversation.forEach((msg, idx) => {
timers.push(setTimeout(() => {
setVisibleMessages(prev => {
// prevent duplicate inserts
if (prev.some(x => x.id === msg.id)) return prev;
return [...prev, msg];
});


if (idx === welcomeConversation.length - 1) {
      timers.push(setTimeout(() => {
        setShowButton(true);
        setAnimationComplete(true);
      }, 2000));
    }
  }, msg.delay));
});
}, 2000));


return () => timers.forEach(t => clearTimeout(t));
}, []); // empty deps so it runs only once


  const handleStartClick = () => {
    if (!animationComplete) {
      // Speed up animation
      setVisibleMessages(welcomeConversation);
      setShowButton(true);
      setAnimationComplete(true);
      return;
    }
    
    // Navigate to tutorial
    onStartMission();
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {emotions.map((emotion, index) => (
          <motion.div
            key={emotion.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 1 }}
            className={`absolute text-6xl ${emotion.color}`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {emotion.emoji}
          </motion.div>
        ))}
      </div>

      {/* Title Section */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-8 z-10"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🕵️ Emotion Detective Mission
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/90 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Help Tom & Jerry understand feelings!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Images Section */}
      <AnimatePresence>
        {showImages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="flex items-center justify-center gap-8 mb-8 z-10"
          >
            {/* Tom Image */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={TomImg} 
                  alt="Tom Cat"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-white text-4xl md:text-6xl font-bold" style={{display: 'none'}}>
                  T
                </div>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm"
              >
                😺
              </motion.div>
            </motion.div>

            {/* VS Text */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg"
            >
              &
            </motion.div>

            {/* Jerry Image */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={JerryImg} 
                  alt="Jerry Mouse"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* <div className="w-full h-full flex items-center justify-center text-white text-4xl md:text-6xl font-bold" style={{display: 'none'}}>
                  J
                </div> */}
              </div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm"
              >
                🐭
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation Section */}
      <div className="w-full max-w-4xl mx-auto z-10">
        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <div ref={chatRef} className="max-h-96 overflow-y-auto space-y-4">
            {visibleMessages.map((message, index) => (
              <ChatBubble       
                key={message.id}
                speaker={message.speaker}
                text={message.text}
                delay={message.delay}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Emotion Preview Badges */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 mt-8 mb-8"
      >
        {emotions.map((emotion, index) => (
          <motion.div
            key={emotion.name}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, delay: index * 0.2 },
              hover: { duration: 0.2 }
            }}
            className={`w-16 h-16 ${emotion.bg} rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
            title={emotion.name}
          >
            {emotion.emoji}
          </motion.div>
        ))}
      </motion.div>

      {/* Start Mission Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartClick}
            className={`px-8 py-4 text-xl md:text-2xl font-bold text-white rounded-full shadow-2xl transition-all duration-300 ${
              animationComplete 
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}
          >
            <motion.span
              animate={animationComplete ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-3"
            >
              🚀 Start Mission
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading Animation for Incomplete State */}
      {!animationComplete && showButton && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-6 right-6 w-8 h-8 border-4 border-white border-t-transparent rounded-full"
        />
      )}
    </div>
  );
};

export default Firstpage;
