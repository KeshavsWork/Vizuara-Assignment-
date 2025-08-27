import { motion } from 'framer-motion';

const Chatbubble = ({ speaker, text, delay, index }) => {
  const isJerry = speaker === 'jerry';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: delay / 1000, 
        duration: 0.6,
        type: "spring",
        stiffness: 100 
      }}
      className={`flex items-start gap-4 mb-6 ${isJerry ? 'flex-row-reverse' : ''}`}
    >
      {/* Character Avatar */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ${
          isJerry 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}
      >
        {isJerry ? 'J' : 'T'}
      </motion.div>

      {/* Chat Bubble */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`chat-bubble ${isJerry ? 'jerry-bubble' : 'tom-bubble'} max-w-md px-6 py-4 bg-white rounded-2xl shadow-lg`}
      >
        <div className={`text-sm font-bold mb-2 ${isJerry ? 'text-blue-600' : 'text-red-600'}`}>
          {isJerry ? 'Jerry' : 'Tom'}
        </div>
        <p className="text-gray-800 text-lg leading-relaxed">{text}</p>
      </motion.div>
    </motion.div>
  );
};

export default Chatbubble;
