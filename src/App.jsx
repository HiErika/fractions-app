import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, Star, Trophy, BookOpen, Gamepad2, Award, ChevronRight, Check, X, Volume2, VolumeX } from 'lucide-react';
                                                                                                                                                                                                                  
  // Pizza Confetti Component                                                                                                                                                                                       
  const PizzaConfetti = ({ count = 20 }) => {                                                                                                                                                                       
    const confettiPieces = useMemo(() => {                                                                                                                                                                          
      return Array.from({ length: count }, (_, i) => ({                                                                                                                                                             
        id: i,                                                                                                                                                                                                      
        left: Math.random() * 100,                                                                                                                                                                                  
        delay: Math.random() * 0.5,                                                                                                                                                                                 
        duration: 2 + Math.random() * 2,                                                                                                                                                                            
        size: 24 + Math.random() * 24,                                                                                                                                                                              
        rotation: Math.random() * 360,                                                                                                                                                                              
        rotationSpeed: (Math.random() - 0.5) * 720,                                                                                                                                                                 
      }));                                                                                                                                                                                                          
    }, [count]);                                                                                                                                                                                                    
                                                                                                                                                                                                                    
    return (                                                                                                                                                                                                        
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">                                                                                                                                      
        {confettiPieces.map((piece) => (                                                                                                                                                                            
          <div                                                                                                                                                                                                      
            key={piece.id}                                                                                                                                                                                          
            className="absolute animate-confetti-fall"                                                                                                                                                              
            style={{                                                                                                                                                                                                
              left: `${piece.left}%`,                                                                                                                                                                               
              top: '-50px',                                                                                                                                                                                         
              fontSize: `${piece.size}px`,                                                                                                                                                                          
              animationDelay: `${piece.delay}s`,                                                                                                                                                                    
              animationDuration: `${piece.duration}s`,                                                                                                                                                              
              '--rotation-start': `${piece.rotation}deg`,                                                                                                                                                           
              '--rotation-end': `${piece.rotation + piece.rotationSpeed}deg`,                                                                                                                                       
            }}                                                                                                                                                                                                      
          >                                                                                                                                                                                                         
            🍕                                                                                                                                                                                                      
          </div>                                                                                                                                                                                                    
        ))}                                                                                                                                                                                                         
      </div>                                                                                                                                                                                                        
    );                                                                                                                                                                                                              
  };                               
const FractionsApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [progress, setProgress] = useState({
    lessonsCompleted: [],
    gamesPlayed: 0,
    totalStars: 0,
    achievements: []
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound effect functions using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      // Happy ascending notes
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } else if (type === 'wrong') {
      // Gentle descending note
      oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
      oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.15); // E4
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'click') {
      // Quick click sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } else if (type === 'star') {
      // Sparkly star sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime); // C6
      oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.05); // E6
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'complete') {
      // Victory fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
        osc.start(audioContext.currentTime + i * 0.15);
        osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
      });
    }
  };

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fractionsProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fractionsProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const addStars = (count) => {
    setProgress(prev => ({
      ...prev,
      totalStars: prev.totalStars + count
    }));
    playSound('star');
  };

  const completeLesson = (lessonId) => {
    setProgress(prev => ({
      ...prev,
      lessonsCompleted: [...new Set([...prev.lessonsCompleted, lessonId])]
    }));
  };

  const incrementGamesPlayed = () => {
    setProgress(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Sound Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound('click');
            }}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-purple-600" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>

        {currentScreen === 'home' && (
          <HomeScreen 
            setCurrentScreen={setCurrentScreen} 
            progress={progress}
            playSound={playSound}
          />
        )}
        {currentScreen === 'lesson1' && (
          <LessonOne 
            setCurrentScreen={setCurrentScreen}
            completeLesson={completeLesson}
            addStars={addStars}
            playSound={playSound}
          />
        )}
        {currentScreen === 'lesson2' && (
          <LessonTwo 
            setCurrentScreen={setCurrentScreen}
            completeLesson={completeLesson}
            addStars={addStars}
            playSound={playSound}
          />
        )}
        {currentScreen === 'lesson3' && (
          <LessonThree 
            setCurrentScreen={setCurrentScreen}
            completeLesson={completeLesson}
            addStars={addStars}
            playSound={playSound}
          />
        )}
        {currentScreen === 'lesson4' && (
          <LessonFour 
            setCurrentScreen={setCurrentScreen}
            completeLesson={completeLesson}
            addStars={addStars}
            playSound={playSound}
          />
        )}
        {currentScreen === 'game1' && (
          <PizzaGame 
            setCurrentScreen={setCurrentScreen}
            incrementGamesPlayed={incrementGamesPlayed}
            addStars={addStars}
            playSound={playSound}
          />
        )}
      </div>
    </div>
  );
};

const HomeScreen = ({ setCurrentScreen, progress, playSound }) => {
  const lessons = [
    { id: 'lesson1', title: 'What are Fractions?', icon: '🍕', color: 'blue' },
    { id: 'lesson2', title: 'Comparing Fractions', icon: '⚖️', color: 'green' },
    { id: 'lesson3', title: 'Adding Fractions', icon: '➕', color: 'orange' },
    { id: 'lesson4', title: 'Fractions to Decimals', icon: '🔢', color: 'purple' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
          <h1 className="text-5xl font-bold text-purple-600">Fraction Fun!</h1>
          <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-xl text-gray-600">Learn fractions through fun games and lessons!</p>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-300">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              <span className="text-3xl font-bold text-purple-600">{progress.totalStars}</span>
            </div>
            <p className="text-gray-600 font-semibold">Stars Earned</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-blue-600">{progress.lessonsCompleted.length}/4</span>
            </div>
            <p className="text-gray-600 font-semibold">Lessons Done</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">{progress.gamesPlayed}</span>
            </div>
            <p className="text-gray-600 font-semibold">Games Played</p>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <h2 className="text-3xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Lessons
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                playSound('click');
                setCurrentScreen(lesson.id);
              }}
              className={`bg-gradient-to-br from-${lesson.color}-400 to-${lesson.color}-600 rounded-2xl shadow-lg p-6 text-white transform transition hover:scale-105 hover:shadow-xl border-4 border-${lesson.color}-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-5xl">{lesson.icon}</span>
                {progress.lessonsCompleted.includes(lesson.id) && (
                  <div className="bg-green-500 rounded-full p-2">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{lesson.title}</h3>
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold">Start Lesson</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Games Section */}
      <div>
        <h2 className="text-3xl font-bold text-pink-600 mb-4 flex items-center gap-2">
          <Gamepad2 className="w-8 h-8" />
          Games
        </h2>
        <button
          onClick={() => {
            playSound('click');
            setCurrentScreen('game1');
          }}
          className="w-full bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-xl p-8 text-white transform transition hover:scale-105 hover:shadow-2xl border-4 border-pink-300"
        >
          <div className="flex items-center justify-between mb-4">
            <Gamepad2 className="w-16 h-16" />
            <div className="bg-yellow-400 rounded-full px-4 py-2">
              <span className="text-pink-600 font-bold text-lg">Play!</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Pizza Fractions</h2>
          <p className="text-lg opacity-90 mb-4">Build pizzas and learn fractions by playing!</p>
          <div className="flex items-center gap-2 text-yellow-300">
            <ChevronRight className="w-6 h-6" />
            <span className="font-semibold">Play Game</span>
          </div>
        </button>
      </div>
    </div>
  );
};

const LessonOne = ({ setCurrentScreen, completeLesson, addStars, playSound }) => {
  const [step, setStep] = useState(0);
  const [selectedPieces, setSelectedPieces] = useState(0);

  const steps = [
    {
      title: "What is a Fraction?",
      content: "A fraction is a part of a whole! Let's learn by looking at a delicious pizza! 🍕",
      visual: "intro"
    },
    {
      title: "One Whole Pizza",
      content: "Here's a whole pizza. This is 1 complete pizza. We can write this as 1/1 or just 1.",
      visual: "whole"
    },
    {
      title: "Splitting in Half",
      content: "When we cut the pizza into 2 equal pieces, each piece is ONE HALF. We write this as 1/2.",
      visual: "half"
    },
    {
      title: "Your Turn!",
      content: "Click on the pizza pieces to see fractions! Try selecting different amounts.",
      visual: "interactive"
    },
    {
      title: "Great Job!",
      content: "You learned what fractions are! You earned stars! ⭐",
      visual: "complete"
    }
  ];

  const nextStep = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
      if (step === steps.length - 2) {
        completeLesson('lesson1');
        addStars(3);
        playSound('complete');
      }
    } else {
      setCurrentScreen('home');
    }
  };

  const renderVisual = () => {
    const currentStep = steps[step];

    if (currentStep.visual === "intro") {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-9xl animate-bounce">🍕</div>
        </div>
      );
    }

    if (currentStep.visual === "whole") {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="relative">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-8 border-yellow-600 shadow-2xl flex items-center justify-center">
              <span className="text-4xl font-bold text-white">1/1</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-red-400 opacity-20"></div>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "half") {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-yellow-600 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500">
                <div className="absolute top-0 left-0 w-full h-full" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)'}}>
                  <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full" style={{clipPath: 'polygon(50% 50%, 50% 0%, 0% 0%, 0% 100%, 50% 100%)'}}>
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-600"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1 h-full bg-yellow-700"></div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-3xl font-bold text-white bg-orange-600 rounded-full px-4 py-2 shadow-lg">1/2</span>
            </div>
            <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
              <span className="text-3xl font-bold text-white bg-orange-600 rounded-full px-4 py-2 shadow-lg">1/2</span>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "interactive") {
      const totalPieces = 4;
      const pieces = Array.from({ length: totalPieces }, (_, i) => i);

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center p-8">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-yellow-600 shadow-2xl">
                {pieces.map((piece) => {
                  const angle = (360 / totalPieces) * piece;
                  const isSelected = piece < selectedPieces;
                  
                  return (
                    <button
                      key={piece}
                      onClick={() => {
                        setSelectedPieces(piece + 1);
                        playSound('click');
                      }}
                      className="absolute inset-0 transition-all duration-300"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/totalPieces) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/totalPieces) * Math.PI) / 180)}%)`
                      }}
                    >
                      <div className={`w-full h-full transition-all duration-300 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-orange-400 to-red-500 scale-95' 
                          : 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:scale-105'
                      }`}>
                      </div>
                    </button>
                  );
                })}
                {pieces.map((piece) => {
                  const angle = (360 / totalPieces) * piece;
                  return (
                    <div
                      key={`border-${piece}`}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, 50% 50%)`
                      }}
                    >
                      <div className="w-full h-full border-r-4 border-yellow-700"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-block bg-white rounded-2xl shadow-xl p-6 border-4 border-purple-300">
              <p className="text-2xl font-bold text-gray-700 mb-2">You selected:</p>
              <p className="text-6xl font-bold text-purple-600">
                {selectedPieces}/{totalPieces}
              </p>
              <p className="text-xl text-gray-600 mt-2">
                {selectedPieces === 0 && "Click on pizza slices!"}
                {selectedPieces === 1 && "One quarter!"}
                {selectedPieces === 2 && "Two quarters = One half!"}
                {selectedPieces === 3 && "Three quarters!"}
                {selectedPieces === 4 && "The whole pizza!"}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "complete") {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
          <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
          <div className="flex gap-3">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
          </div>
          <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          playSound('click');
          setCurrentScreen('home');
        }}
        className="bg-white rounded-full px-6 py-3 shadow-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-300">
        <div className="bg-blue-100 p-4">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  idx <= step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-600">
            {steps[step].title}
          </h2>
          <p className="text-2xl text-center mb-8 text-gray-700">
            {steps[step].content}
          </p>

          {renderVisual()}
        </div>

        <div className="bg-blue-50 p-6 flex justify-center">
          <button
            onClick={nextStep}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-3"
          >
            {step === steps.length - 1 ? 'Finish!' : 'Next'}
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LessonTwo = ({ setCurrentScreen, completeLesson, addStars, playSound }) => {
  const [step, setStep] = useState(0);
  const [selectedFraction, setSelectedFraction] = useState(null);

  const steps = [
    {
      title: "Comparing Fractions",
      content: "Let's learn which fractions are bigger or smaller!",
      visual: "intro"
    },
    {
      title: "Same Bottom Number",
      content: "When fractions have the same bottom number (denominator), the one with the bigger top number (numerator) is larger!",
      visual: "same-denominator",
      fractions: [{num: 1, den: 4}, {num: 3, den: 4}]
    },
    {
      title: "1/2 vs 1/4",
      content: "When fractions have the same top number, the one with the SMALLER bottom number is actually BIGGER!",
      visual: "same-numerator",
      fractions: [{num: 1, den: 2}, {num: 1, den: 4}]
    },
    {
      title: "Your Turn!",
      content: "Which fraction is bigger? Click on the larger one!",
      visual: "interactive"
    },
    {
      title: "Awesome!",
      content: "You can now compare fractions! ⭐",
      visual: "complete"
    }
  ];

  const nextStep = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
      setSelectedFraction(null);
      if (step === steps.length - 2) {
        completeLesson('lesson2');
        addStars(3);
        playSound('complete');
      }
    } else {
      setCurrentScreen('home');
    }
  };

  const renderPizzaFraction = (numerator, denominator, size = 'w-40 h-40') => {
    const pieces = Array.from({ length: denominator }, (_, i) => i);
    
    return (
      <div className={`relative ${size}`}>
        <div className="absolute inset-0 rounded-full overflow-hidden border-6 border-yellow-600 shadow-xl">
          {pieces.map((piece) => {
            const angle = (360 / denominator) * piece;
            const isColored = piece < numerator;
            
            return (
              <div
                key={piece}
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/denominator) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/denominator) * Math.PI) / 180)}%)`
                }}
              >
                <div className={`w-full h-full ${
                  isColored 
                    ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                    : 'bg-gradient-to-br from-yellow-200 to-yellow-300'
                }`}>
                </div>
              </div>
            );
          })}
          {pieces.map((piece) => {
            const angle = (360 / denominator) * piece;
            return (
              <div
                key={`border-${piece}`}
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, 50% 50%)`
                }}
              >
                <div className="w-full h-full border-r-4 border-yellow-700"></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisual = () => {
    const currentStep = steps[step];

    if (currentStep.visual === "intro") {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-9xl animate-bounce">⚖️</div>
        </div>
      );
    }

    if (currentStep.visual === "same-denominator") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              {renderPizzaFraction(1, 4, 'w-48 h-48')}
              <p className="text-4xl font-bold text-purple-600 mt-4">1/4</p>
              <p className="text-lg text-gray-600">Smaller</p>
            </div>
            <div className="text-6xl font-bold text-gray-400">&lt;</div>
            <div className="text-center">
              {renderPizzaFraction(3, 4, 'w-48 h-48')}
              <p className="text-4xl font-bold text-green-600 mt-4">3/4</p>
              <p className="text-lg text-gray-600">Bigger!</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-green-800">
              3/4 is bigger than 1/4 because 3 is bigger than 1!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "same-numerator") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              {renderPizzaFraction(1, 2, 'w-48 h-48')}
              <p className="text-4xl font-bold text-green-600 mt-4">1/2</p>
              <p className="text-lg text-gray-600">Bigger!</p>
            </div>
            <div className="text-6xl font-bold text-gray-400">&gt;</div>
            <div className="text-center">
              {renderPizzaFraction(1, 4, 'w-48 h-48')}
              <p className="text-4xl font-bold text-purple-600 mt-4">1/4</p>
              <p className="text-lg text-gray-600">Smaller</p>
            </div>
          </div>
          <div className="bg-blue-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-blue-800">
              1/2 is bigger than 1/4 because cutting into 2 pieces makes bigger slices than cutting into 4!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "interactive") {
      const challenge = {num1: 2, den1: 3, num2: 1, den2: 3, answer: 0};
      
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => {
                setSelectedFraction(0);
                playSound('correct');
              }}
              className={`text-center transform transition ${
                selectedFraction === 0 ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`rounded-3xl p-6 ${
                selectedFraction === 0 ? 'bg-green-100 border-4 border-green-500' : 'bg-white border-4 border-gray-300'
              }`}>
                {renderPizzaFraction(2, 3, 'w-52 h-52')}
                <p className="text-5xl font-bold text-purple-600 mt-4">2/3</p>
              </div>
            </button>
            
            <div className="text-5xl font-bold text-gray-400">vs</div>
            
            <button
              onClick={() => {
                setSelectedFraction(1);
                playSound('wrong');
              }}
              className={`text-center transform transition ${
                selectedFraction === 1 ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`rounded-3xl p-6 ${
                selectedFraction === 1 ? 'bg-red-100 border-4 border-red-500' : 'bg-white border-4 border-gray-300'
              }`}>
                {renderPizzaFraction(1, 3, 'w-52 h-52')}
                <p className="text-5xl font-bold text-purple-600 mt-4">1/3</p>
              </div>
            </button>
          </div>
          
          {selectedFraction === 0 && (
            <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-green-800 font-bold">
                ✓ Correct! 2/3 is bigger than 1/3!
              </p>
            </div>
          )}
          
          {selectedFraction === 1 && (
            <div className="bg-orange-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-orange-800 font-bold">
                Try again! Look at how much pizza is colored in each one.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (currentStep.visual === "complete") {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
          <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
          <div className="flex gap-3">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
          </div>
          <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          playSound('click');
          setCurrentScreen('home');
        }}
        className="bg-white rounded-full px-6 py-3 shadow-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-300">
        <div className="bg-green-100 p-4">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  idx <= step ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-green-600">
            {steps[step].title}
          </h2>
          <p className="text-2xl text-center mb-8 text-gray-700">
            {steps[step].content}
          </p>

          {renderVisual()}
        </div>

        <div className="bg-green-50 p-6 flex justify-center">
          <button
            onClick={nextStep}
            disabled={step === 3 && selectedFraction !== 0}
            className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-3 ${
              step === 3 && selectedFraction !== 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === steps.length - 1 ? 'Finish!' : step === 3 && selectedFraction !== 0 ? 'Select the bigger fraction!' : 'Next'}
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LessonThree = ({ setCurrentScreen, completeLesson, addStars, playSound }) => {
  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const steps = [
    {
      title: "Adding Fractions",
      content: "Let's learn how to add fractions together!",
      visual: "intro"
    },
    {
      title: "Same Bottom Numbers",
      content: "When fractions have the same bottom number (denominator), just add the top numbers!",
      visual: "example1",
      problem: "1/4 + 2/4 = ?",
      answer: "3/4"
    },
    {
      title: "Let's See It!",
      content: "1/4 + 2/4 = 3/4. We keep the bottom number the same and add 1 + 2 = 3!",
      visual: "visual1"
    },
    {
      title: "Your Turn!",
      content: "What is 1/3 + 1/3 = ?",
      visual: "interactive",
      problem: "1/3 + 1/3 = ?",
      answer: "2/3"
    },
    {
      title: "Amazing!",
      content: "You can add fractions! ⭐",
      visual: "complete"
    }
  ];

  const nextStep = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
      setUserAnswer('');
      if (step === steps.length - 2) {
        completeLesson('lesson3');
        addStars(3);
        playSound('complete');
      }
    } else {
      setCurrentScreen('home');
    }
  };

  const renderPizzaFraction = (numerator, denominator, size = 'w-32 h-32') => {
    const pieces = Array.from({ length: denominator }, (_, i) => i);
    
    return (
      <div className={`relative ${size}`}>
        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-yellow-600 shadow-xl">
          {pieces.map((piece) => {
            const angle = (360 / denominator) * piece;
            const isColored = piece < numerator;
            
            return (
              <div
                key={piece}
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/denominator) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/denominator) * Math.PI) / 180)}%)`
                }}
              >
                <div className={`w-full h-full ${
                  isColored 
                    ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                    : 'bg-gradient-to-br from-yellow-200 to-yellow-300'
                }`}>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisual = () => {
    const currentStep = steps[step];

    if (currentStep.visual === "intro") {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-9xl animate-bounce">➕</div>
        </div>
      );
    }

    if (currentStep.visual === "example1" || currentStep.visual === "visual1") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              {renderPizzaFraction(1, 4, 'w-40 h-40')}
              <p className="text-3xl font-bold text-purple-600 mt-3">1/4</p>
            </div>
            <div className="text-5xl font-bold text-orange-500">+</div>
            <div className="text-center">
              {renderPizzaFraction(2, 4, 'w-40 h-40')}
              <p className="text-3xl font-bold text-purple-600 mt-3">2/4</p>
            </div>
            <div className="text-5xl font-bold text-gray-400">=</div>
            <div className="text-center">
              {renderPizzaFraction(3, 4, 'w-40 h-40')}
              <p className="text-3xl font-bold text-green-600 mt-3">3/4</p>
            </div>
          </div>
          <div className="bg-orange-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-orange-800">
              1 + 2 = 3, so 1/4 + 2/4 = 3/4!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "interactive") {
      const isCorrect = userAnswer === '2/3' || userAnswer === '2 / 3';
      
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              {renderPizzaFraction(1, 3, 'w-44 h-44')}
              <p className="text-4xl font-bold text-purple-600 mt-4">1/3</p>
            </div>
            <div className="text-6xl font-bold text-orange-500">+</div>
            <div className="text-center">
              {renderPizzaFraction(1, 3, 'w-44 h-44')}
              <p className="text-4xl font-bold text-purple-600 mt-4">1/3</p>
            </div>
            <div className="text-6xl font-bold text-gray-400">=</div>
            <div className="text-center">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  if (e.target.value === '2/3' || e.target.value === '2 / 3') {
                    playSound('correct');
                  }
                }}
                placeholder="?"
                className="w-32 h-20 text-5xl font-bold text-center border-4 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          
          {isCorrect && (
            <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-green-800 font-bold">
                ✓ Perfect! 1/3 + 1/3 = 2/3!
              </p>
            </div>
          )}
          
          {userAnswer && !isCorrect && (
            <div className="bg-orange-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-orange-800 font-bold">
                Keep trying! Add the top numbers: 1 + 1 = ?
              </p>
            </div>
          )}
        </div>
      );
    }

    if (currentStep.visual === "complete") {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
          <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
          <div className="flex gap-3">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
          </div>
          <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
        </div>
      );
    }
  };

  const isInteractiveCorrect = step === 3 && (userAnswer === '2/3' || userAnswer === '2 / 3');

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          playSound('click');
          setCurrentScreen('home');
        }}
        className="bg-white rounded-full px-6 py-3 shadow-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-300">
        <div className="bg-orange-100 p-4">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  idx <= step ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-orange-600">
            {steps[step].title}
          </h2>
          <p className="text-2xl text-center mb-8 text-gray-700">
            {steps[step].content}
          </p>

          {renderVisual()}
        </div>

        <div className="bg-orange-50 p-6 flex justify-center">
          <button
            onClick={nextStep}
            disabled={step === 3 && !isInteractiveCorrect}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-3 ${
              step === 3 && !isInteractiveCorrect ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === steps.length - 1 ? 'Finish!' : step === 3 && !isInteractiveCorrect ? 'Answer the problem!' : 'Next'}
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LessonFour = ({ setCurrentScreen, completeLesson, addStars, playSound }) => {
  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const steps = [
    {
      title: "Fractions to Decimals",
      content: "Let's learn how to turn fractions into decimals!",
      visual: "intro"
    },
    {
      title: "What's a Decimal?",
      content: "Decimals are another way to show parts of a whole, using a dot! Like 0.5 or 0.25",
      visual: "explain"
    },
    {
      title: "1/2 = 0.5",
      content: "One half (1/2) is the same as 0.5 (five tenths)!",
      visual: "half"
    },
    {
      title: "1/4 = 0.25",
      content: "One quarter (1/4) is the same as 0.25 (twenty-five hundredths)!",
      visual: "quarter"
    },
    {
      title: "Your Turn!",
      content: "What decimal is the same as 3/4?",
      visual: "interactive",
      answer: "0.75"
    },
    {
      title: "Fantastic!",
      content: "You can convert fractions to decimals! ⭐",
      visual: "complete"
    }
  ];

  const nextStep = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
      setUserAnswer('');
      if (step === steps.length - 2) {
        completeLesson('lesson4');
        addStars(3);
        playSound('complete');
      }
    } else {
      setCurrentScreen('home');
    }
  };

  const renderVisual = () => {
    const currentStep = steps[step];

    if (currentStep.visual === "intro") {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-9xl animate-bounce">🔢</div>
        </div>
      );
    }

    if (currentStep.visual === "explain") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-8 text-6xl font-bold">
            <span className="text-purple-600">1/2</span>
            <span className="text-gray-400">=</span>
            <span className="text-green-600">0.5</span>
          </div>
          <div className="bg-blue-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-blue-800">
              They both mean "half of something"!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "half") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="w-48 h-48 border-8 border-purple-500 rounded-2xl overflow-hidden">
                <div className="h-full flex">
                  <div className="w-1/2 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="w-1/2 bg-gray-200"></div>
                </div>
              </div>
              <p className="text-4xl font-bold text-purple-600 mt-4">1/2</p>
            </div>
            <div className="text-6xl font-bold text-gray-400">=</div>
            <div className="text-center">
              <div className="w-48 h-48 border-8 border-green-500 rounded-2xl flex items-center justify-center bg-white">
                <p className="text-6xl font-bold text-green-600">0.5</p>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-4">Half</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "quarter") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="w-48 h-48 border-8 border-purple-500 rounded-2xl overflow-hidden">
                <div className="h-full flex flex-wrap">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="w-1/2 h-1/2 bg-gray-200"></div>
                  <div className="w-1/2 h-1/2 bg-gray-200"></div>
                  <div className="w-1/2 h-1/2 bg-gray-200"></div>
                </div>
              </div>
              <p className="text-4xl font-bold text-purple-600 mt-4">1/4</p>
            </div>
            <div className="text-6xl font-bold text-gray-400">=</div>
            <div className="text-center">
              <div className="w-48 h-48 border-8 border-green-500 rounded-2xl flex items-center justify-center bg-white">
                <p className="text-6xl font-bold text-green-600">0.25</p>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-4">Quarter</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "interactive") {
      const isCorrect = userAnswer === '0.75' || userAnswer === '.75';
      
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="w-52 h-52 border-8 border-purple-500 rounded-2xl overflow-hidden">
                <div className="h-full flex flex-wrap">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-orange-400 to-red-500"></div>
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-orange-400 to-red-500"></div>
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-orange-400 to-red-500"></div>
                  <div className="w-1/2 h-1/2 bg-gray-200"></div>
                </div>
              </div>
              <p className="text-5xl font-bold text-purple-600 mt-4">3/4</p>
            </div>
            <div className="text-6xl font-bold text-gray-400">=</div>
            <div className="text-center">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  if (e.target.value === '0.75' || e.target.value === '.75') {
                    playSound('correct');
                  }
                }}
                placeholder="?"
                className="w-48 h-52 text-6xl font-bold text-center border-8 border-purple-500 rounded-2xl focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="bg-blue-100 rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-lg text-center text-blue-800">
              Hint: 1/4 = 0.25, so 3/4 = 0.25 + 0.25 + 0.25 = ?
            </p>
          </div>
          
          {isCorrect && (
            <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-green-800 font-bold">
                ✓ Excellent! 3/4 = 0.75!
              </p>
            </div>
          )}
          
          {userAnswer && !isCorrect && (
            <div className="bg-orange-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-orange-800 font-bold">
                Keep trying! Think about 1/4 = 0.25
              </p>
            </div>
          )}
        </div>
      );
    }

    if (currentStep.visual === "complete") {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
          <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
          <div className="flex gap-3">
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
            <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
          </div>
          <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
        </div>
      );
    }
  };

  const isInteractiveCorrect = step === 4 && (userAnswer === '0.75' || userAnswer === '.75');

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          playSound('click');
          setCurrentScreen('home');
        }}
        className="bg-white rounded-full px-6 py-3 shadow-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300">
        <div className="bg-purple-100 p-4">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  idx <= step ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-purple-600">
            {steps[step].title}
          </h2>
          <p className="text-2xl text-center mb-8 text-gray-700">
            {steps[step].content}
          </p>

          {renderVisual()}
        </div>

        <div className="bg-purple-50 p-6 flex justify-center">
          <button
            onClick={nextStep}
            disabled={step === 4 && !isInteractiveCorrect}
            className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-3 ${
              step === 4 && !isInteractiveCorrect ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === steps.length - 1 ? 'Finish!' : step === 4 && !isInteractiveCorrect ? 'Answer the problem!' : 'Next'}
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PizzaGame = ({ setCurrentScreen, incrementGamesPlayed, addStars, playSound }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = () => {
    const types = ['identify', 'compare'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'identify') {
      const denominator = [2, 3, 4][Math.floor(Math.random() * 3)];
      const numerator = Math.floor(Math.random() * denominator) + 1;
      
      return {
        type: 'identify',
        question: `What fraction of the pizza is colored?`,
        visual: { numerator, denominator },
        correctAnswer: `${numerator}/${denominator}`,
        options: generateOptions(numerator, denominator)
      };
    }

    if (type === 'compare') {
      const fracs = [
        [{num: 1, den: 2}, {num: 1, den: 4}, '1/2'],
        [{num: 2, den: 3}, {num: 1, den: 3}, '2/3'],
        [{num: 3, den: 4}, {num: 1, den: 4}, '3/4']
      ];
      const chosen = fracs[Math.floor(Math.random() * fracs.length)];
      
      return {
        type: 'compare',
        question: `Which fraction is bigger?`,
        visual: { frac1: chosen[0], frac2: chosen[1] },
        correctAnswer: chosen[2],
        options: [chosen[2], `${chosen[1].num}/${chosen[1].den}`, 'They are equal'].sort(() => Math.random() - 0.5)
      };
    }
  };

  const generateOptions = (correctNum, correctDen) => {
    const correct = `${correctNum}/${correctDen}`;
    const options = [correct];
    
    while (options.length < 3) {
      const num = Math.floor(Math.random() * correctDen) + 1;
      const option = `${num}/${correctDen}`;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.correctAnswer) {
      setFeedback('correct');
      setScore(score + 10);
      addStars(1);
      playSound('correct');
    } else {
      setFeedback('incorrect');
      playSound('wrong');
    }

    setTimeout(() => {
      setQuestionsAnswered(questionsAnswered + 1);
      if (questionsAnswered + 1 >= 5) {
        incrementGamesPlayed();
        setFeedback('complete');
        playSound('complete');
      } else {
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setFeedback(null);
      }
    }, 2000);
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    if (currentQuestion.type === 'identify') {
      const { numerator, denominator } = currentQuestion.visual;
      const pieces = Array.from({ length: denominator }, (_, i) => i);

      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center p-8">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-yellow-600 shadow-2xl">
                {pieces.map((piece) => {
                  const angle = (360 / denominator) * piece;
                  const isColored = piece < numerator;
                  
                  return (
                    <div
                      key={piece}
                      className="absolute inset-0"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/denominator) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/denominator) * Math.PI) / 180)}%)`
                      }}
                    >
                      <div className={`w-full h-full ${
                        isColored 
                          ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                          : 'bg-gradient-to-br from-yellow-200 to-yellow-300'
                      }`}>
                      </div>
                    </div>
                  );
                })}
                {pieces.map((piece) => {
                  const angle = (360 / denominator) * piece;
                  return (
                    <div
                      key={`border-${piece}`}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, 50% 50%)`
                      }}
                    >
                      <div className="w-full h-full border-r-4 border-yellow-700"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-3xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-red-500 text-white scale-95'
                    : 'bg-white text-purple-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === 'compare') {
      const renderPizza = (frac) => {
        const pieces = Array.from({ length: frac.den }, (_, i) => i);
        return (
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full overflow-hidden border-6 border-yellow-600 shadow-xl">
              {pieces.map((piece) => {
                const angle = (360 / frac.den) * piece;
                const isColored = piece < frac.num;
                return (
                  <div
                    key={piece}
                    className="absolute inset-0"
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/frac.den) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/frac.den) * Math.PI) / 180)}%)`
                    }}
                  >
                    <div className={`w-full h-full ${
                      isColored 
                        ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                        : 'bg-gradient-to-br from-yellow-200 to-yellow-300'
                    }`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      };

      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-8 p-8">
            <div className="text-center">
              {renderPizza(currentQuestion.visual.frac1)}
              <p className="text-3xl font-bold text-purple-600 mt-4">{currentQuestion.visual.frac1.num}/{currentQuestion.visual.frac1.den}</p>
            </div>
            <div className="text-5xl font-bold text-gray-400">vs</div>
            <div className="text-center">
              {renderPizza(currentQuestion.visual.frac2)}
              <p className="text-3xl font-bold text-purple-600 mt-4">{currentQuestion.visual.frac2.num}/{currentQuestion.visual.frac2.den}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-2xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-red-500 text-white scale-95'
                    : 'bg-white text-purple-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  if (feedback === 'complete') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-green-300">
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-5xl font-bold text-green-600 mb-4">Awesome Job!</h2>
          <p className="text-3xl text-gray-700 mb-6">You scored {score} points!</p>
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: Math.min(5, Math.floor(score / 10)) }).map((_, i) => (
              <Star key={i} className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <button
            onClick={() => {
              playSound('click');
              setCurrentScreen('home');
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 border-4 border-pink-300">
        <button
          onClick={() => {
            playSound('click');
            setCurrentScreen('home');
          }}
          className="bg-gray-100 rounded-full px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200 transition"
        >
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-purple-600">{score}</span>
          </div>
          <div className="text-xl font-semibold text-gray-600">
            Question {questionsAnswered + 1} of 5
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-300">
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6">
          <h2 className="text-4xl font-bold text-white text-center">
            {currentQuestion?.question}
          </h2>
        </div>

        <div className="p-8">
          {renderQuestion()}
        </div>

        {feedback && feedback !== 'complete' && (
          <div className={`p-6 text-center ${
            feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="flex items-center justify-center gap-4">
              {feedback === 'correct' ? (
                <>
                  <Check className="w-12 h-12 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">Correct! Great job! 🎉</span>
                </>
              ) : (
                <>
                  <X className="w-12 h-12 text-red-600" />
                  <span className="text-3xl font-bold text-red-600">Try again next time!</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionsApp;
