import { useState } from 'react';
import Firstpage from './pages/FirstPage';
import Tutorial from './pages/Tutorial';
import Practice from './pages/Practice';
import BossRound from './pages/BossRound';
import CreateMode from './pages/CreateMode';
import StoryMode from './pages/StoryMode'; // ADD THIS IMPORT
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [gameResults, setGameResults] = useState(null);
  const [bossResults, setBossResults] = useState(null);

  const handleStartMission = () => {
    setCurrentPage('tutorial');
    console.log('Starting mission - navigating to tutorial');
  };

  const handleContinueFromTutorial = () => {
    setCurrentPage('practice');
    console.log('Continuing to practice mode');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
    console.log('Back to welcome page');
  };

  const handleBackToTutorial = () => {
    setCurrentPage('tutorial');
  };

  const handlePracticeComplete = (results) => {
    setGameResults(results);
    setCurrentPage('results');
  };

  const handleNextLevel = () => {
    setCurrentPage('boss-round');
  };

  const handleBossRoundComplete = (results) => {
    setBossResults(results);
    setCurrentPage('final-results');
  };

  const handlePlayAgain = () => {
    setGameResults(null);
    setBossResults(null);
    setCurrentPage('practice');
  };

  // ADD THIS NEW HANDLER
  const handleBossRoundAgain = () => {
    setBossResults(null);
    setCurrentPage('boss-round');
  };

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <Firstpage onStartMission={handleStartMission} />
      )}
      
      {currentPage === 'tutorial' && (
        <Tutorial 
          onContinue={handleContinueFromTutorial}
          onBack={handleBackToWelcome}
        />
      )}

      {currentPage === 'practice' && (
        <Practice 
          onComplete={handlePracticeComplete}
          onBack={handleBackToTutorial}
        />
      )}

      {currentPage === 'boss-round' && (
        <BossRound 
          onComplete={handleBossRoundComplete}
          onBack={() => setCurrentPage('results')}
        />
      )}

      {/* ADD STORY MODE ROUTE */}
      {currentPage === 'story-mode' && (
        <StoryMode 
          onBack={() => setCurrentPage('welcome')}
          onFinish={() => setCurrentPage('welcome')}
        />
      )}

      {currentPage === 'results' && (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl border border-white/20">
              
              {/* Trophy and Title */}
              <div className="mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">🏆</div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Results</h1>
              </div>

              {/* Score Display */}
              <div className="bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 border border-white/20">
                <p className="text-lg sm:text-xl md:text-2xl mb-2">
                  You scored <span className="font-bold text-green-300">{gameResults?.score || 0}</span> out of <span className="font-bold">{gameResults?.total || 0}</span>!
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white/90">
                  Accuracy: <span className="font-bold text-yellow-300 text-xl sm:text-2xl">
                    {gameResults?.total ? Math.round((gameResults.score / gameResults.total) * 100) : 0}%
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4">
                
                {/* First button - Play Again (Tutorial) */}
                <button 
                  onClick={handleBackToTutorial}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-white text-purple-600 font-bold text-sm sm:text-base rounded-full hover:bg-gray-100 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                >
                  📚 Play Again
                </button>

                {/* Next Level: Boss Round (unlocks at >=70%) */}
                {(gameResults?.total && gameResults.score / gameResults.total >= 0.7) ? (
                  <button 
                    onClick={handleNextLevel}
                    className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm sm:text-base rounded-full hover:from-yellow-600 hover:to-orange-600 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      🔥 <span className="hidden xs:inline">Next Level:</span> Boss Round
                    </span>
                  </button>
                ) : (
                  <div className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white/70 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      🔒 <span>Get 70%+ to unlock Boss Round!</span>
                    </div>
                  </div>
                )}

                {/* ADD STORY MODE BUTTON */}
                <button 
                  onClick={() => setCurrentPage('story-mode')}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm sm:text-base rounded-full hover:from-purple-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    📖 <span>Story Mode</span>
                  </span>
                </button>

                {/* CREATE MODE BUTTON */}
                <button 
                  onClick={() => setCurrentPage('create-mode')}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-sm sm:text-base rounded-full hover:from-pink-600 hover:to-pink-700 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    🎨 <span>Create Mode</span>
                  </span>
                </button>
                
                {/* Try Again */}
                <button 
                  onClick={handlePlayAgain}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-sm sm:text-base rounded-full hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    🔄 <span>Try Again</span>
                  </span>
                </button>
                
                {/* Back to Menu */}
                <button 
                  onClick={handleBackToWelcome}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-white/20 backdrop-blur-sm text-white font-bold text-sm sm:text-base rounded-full hover:bg-white/30 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <span className="flex items-center justify-center gap-2">
                    🏠 <span>Back to Menu</span>
                  </span>
                </button>
              </div>

              {/* Safe area spacing for mobile */}
              <div className="mt-4 sm:mt-6 pb-[env(safe-area-inset-bottom)]" />
            </div>
          </div>
        </div>
      )}

      {currentPage === 'create-mode' && (
        <CreateMode 
          onBack={() => setCurrentPage('welcome')}
        />
      )}

      {/* UPDATED FINAL RESULTS PAGE */}
      {currentPage === 'final-results' && (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl border border-white/20">
              
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 animate-pulse">👑</div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Master Detective!</h1>
              
              <div className="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold mb-3 text-yellow-300">Your Journey:</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span>Practice:</span>
                    <span className="font-bold">
                      {gameResults?.score || 0}/{gameResults?.total || 0} 
                      ({gameResults?.total ? Math.round((gameResults.score / gameResults.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Boss Round:</span>
                    <span className="font-bold">
                      {bossResults?.score || 0}/{bossResults?.total || 0} 
                      ({bossResults?.total ? Math.round((bossResults.score / bossResults.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-2 font-bold text-yellow-300">
                    <div className="flex justify-between items-center">
                      <span>Overall:</span>
                      <span>
                        {(gameResults?.score || 0) + (bossResults?.score || 0)}/
                        {(gameResults?.total || 0) + (bossResults?.total || 0)} 
                        ({Math.round(((gameResults?.score || 0) + (bossResults?.score || 0)) / ((gameResults?.total || 0) + (bossResults?.total || 0)) * 100) || 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Play Full Game Again */}
                <button 
                  onClick={() => {
                    setGameResults(null);
                    setBossResults(null);
                    setCurrentPage('practice');
                  }}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm sm:text-base rounded-full hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    🎯 <span>Play Full Game Again</span>
                  </span>
                </button>

                {/* ADD BOSS ROUND AGAIN BUTTON */}
                <button 
                  onClick={handleBossRoundAgain}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm sm:text-base rounded-full hover:from-yellow-600 hover:to-orange-600 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    👑 <span>Play Boss Round Again</span>
                  </span>
                </button>

                {/* ADD STORY MODE BUTTON */}
                <button 
                  onClick={() => setCurrentPage('story-mode')}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm sm:text-base rounded-full hover:from-purple-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    📖 <span>Story Mode</span>
                  </span>
                </button>

                {/* Create Mode Button */}
                <button 
                  onClick={() => setCurrentPage('create-mode')}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-sm sm:text-base rounded-full hover:from-pink-600 hover:to-pink-700 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    🎨 <span>Create Mode</span>
                  </span>
                </button>
                
                {/* Back to Menu */}
                <button 
                  onClick={handleBackToWelcome}
                  className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-white/20 backdrop-blur-sm text-white font-bold text-sm sm:text-base rounded-full hover:bg-white/30 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <span className="flex items-center justify-center gap-2">
                    🏠 <span>Back to Menu</span>
                  </span>
                </button>
              </div>

              <div className="mt-4 sm:mt-6 pb-[env(safe-area-inset-bottom)]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
