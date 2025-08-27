import { motion } from 'framer-motion';
import { useState } from 'react';

const SoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
const [playBubble] = useSound(bubbleSfx, { volume: 0.5, soundEnabled });
const [playClick] = useSound(clickSfx, { volume: 0.5, soundEnabled, interrupt: true });
const [playPop] = useSound(popSfx, { volume: 0.6, soundEnabled });


  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Add sound logic here later
    console.log('Sound', soundEnabled ? 'disabled' : 'enabled');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleSound}
      className="fixed top-6 right-6 z-50 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:shadow-xl transition-shadow"
      aria-label="Toggle Sound"
    >
      {soundEnabled ? '🔊' : '🔇'}
    </motion.button>
  );
};

export default SoundToggle;
