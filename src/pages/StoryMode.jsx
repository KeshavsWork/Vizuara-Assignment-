import { motion } from 'framer-motion';

const StoryMode = ({ onBack, onFinish }) => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl border border-white/20">
          
          <div className="text-4xl sm:text-5xl mb-4">📖</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Story Mode</h1>
          <p className="text-white/80 mb-6">
            Interactive stories with Tom & Jerry are coming soon! 
            Make choices and learn about emotions through adventure.
          </p>
          
          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/10 rounded-xl border border-white/20"
            >
              <div className="text-lg font-bold mb-1">🏚️ The Haunted House</div>
              <div className="text-sm text-white/70">Face your fears with courage</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/10 rounded-xl border border-white/20"
            >
              <div className="text-lg font-bold mb-1">🎂 The Surprise Party</div>
              <div className="text-sm text-white/70">Navigate social emotions</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/10 rounded-xl border border-white/20"
            >
              <div className="text-lg font-bold mb-1">🏆 The Big Game</div>
              <div className="text-sm text-white/70">Deal with pressure and nerves</div>
            </motion.div>
          </div>
          
          <button 
            onClick={onBack}
            className="mt-6 w-full px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/30 transition-all"
          >
            🏠 Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryMode;
