/* Tailwind safelist (dynamic classes for JIT):
   from-blue-400 to-blue-600 border-blue-300
   from-green-400 to-green-600 border-green-300
   from-orange-400 to-orange-600 border-orange-300
   from-purple-400 to-purple-600 border-purple-300
   from-teal-400 to-teal-600 border-teal-300
   bg-teal-100 bg-teal-50 bg-teal-500 text-teal-600
   from-teal-500 to-teal-600
*/
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
  const [userName, setUserName] = useState('');
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
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 p-4">
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

        {!userName && (
          <NameEntryScreen
            setUserName={(name) => {
              setUserName(name);
              localStorage.setItem('userName', name);
            }}
            playSound={playSound}
          />
        )}
        {userName && currentScreen === 'home' && (
          <HomeScreen
            setCurrentScreen={setCurrentScreen}
            progress={progress}
            playSound={playSound}
            userName={userName}
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
        {currentScreen === 'lesson5' && (
          <LessonFive
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
        {currentScreen === 'game2' && (
          <AddingFractionsGame
            setCurrentScreen={setCurrentScreen}
            incrementGamesPlayed={incrementGamesPlayed}
            addStars={addStars}
            playSound={playSound}
          />
        )}
        {currentScreen === 'game3' && (
          <FractionFaceOff
            setCurrentScreen={setCurrentScreen}
            incrementGamesPlayed={incrementGamesPlayed}
            addStars={addStars}
            playSound={playSound}
          />
        )}
        {currentScreen === 'game4' && (
          <DecimalDash
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

const NameEntryScreen = ({ setUserName, playSound }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      playSound('complete');
      setUserName(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-300 text-center max-w-lg w-full">
        <div className="text-8xl mb-6">🍕</div>
        <h1 className="text-4xl font-bold text-purple-600 mb-3">Fraction Fun!</h1>
        <p className="text-xl text-gray-600 mb-8">Learn fractions through fun games and lessons!</p>
        <div className="space-y-6">
          <div>
            <label className="text-lg font-semibold text-gray-700 block mb-2">What's your name?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your name"
              className="w-full text-2xl font-bold text-center border-4 border-purple-300 rounded-2xl px-6 py-4 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg transform transition flex items-center justify-center gap-3 ${
              name.trim() ? 'hover:shadow-xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ setCurrentScreen, progress, playSound, userName }) => {
  const lessons = [
    { id: 'lesson1', title: 'What are Fractions?', icon: '🍕', color: 'blue' },
    { id: 'lesson2', title: 'Comparing Fractions', icon: '⚖️', color: 'green' },
    { id: 'lesson3', title: 'Adding Fractions', icon: '➕', color: 'orange' },
    { id: 'lesson4', title: 'Fractions to Decimals', icon: '🔢', color: 'purple' },
    { id: 'lesson5', title: 'Adding Different Fractions', icon: '🍕➕🍕', color: 'teal' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
          <h1 className="text-5xl font-bold text-purple-600">{userName}, get ready to have fun with Fractions!</h1>
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
              <span className="text-3xl font-bold text-blue-600">{progress.lessonsCompleted.length}/5</span>
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
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => { playSound('click'); setCurrentScreen('game1'); }}
            className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-lg p-6 text-white transform transition hover:scale-105 hover:shadow-xl border-4 border-pink-300 text-left"
          >
            <span className="text-5xl block mb-3">🍕</span>
            <h3 className="text-xl font-bold mb-1">Pizza Fractions</h3>
            <p className="text-sm opacity-90">Identify and compare fractions!</p>
          </button>
          <button
            onClick={() => { playSound('click'); setCurrentScreen('game2'); }}
            className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform transition hover:scale-105 hover:shadow-xl border-4 border-orange-300 text-left"
          >
            <span className="text-5xl block mb-3">➕</span>
            <h3 className="text-xl font-bold mb-1">Adding Fractions</h3>
            <p className="text-sm opacity-90">Add pizza slices together!</p>
          </button>
          <button
            onClick={() => { playSound('click'); setCurrentScreen('game3'); }}
            className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform transition hover:scale-105 hover:shadow-xl border-4 border-blue-300 text-left"
          >
            <span className="text-5xl block mb-3">⚔️</span>
            <h3 className="text-xl font-bold mb-1">Fraction Face-Off</h3>
            <p className="text-sm opacity-90">Which fraction is bigger?</p>
          </button>
          <button
            onClick={() => { playSound('click'); setCurrentScreen('game4'); }}
            className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform transition hover:scale-105 hover:shadow-xl border-4 border-purple-300 text-left"
          >
            <span className="text-5xl block mb-3">🔢</span>
            <h3 className="text-xl font-bold mb-1">Decimal Dash</h3>
            <p className="text-sm opacity-90">Convert fractions to decimals!</p>
          </button>
        </div>
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
        <>
          <PizzaConfetti count={25} />
          <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
            <div className="flex gap-3">
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
            <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
          </div>
        </>
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
        <>
          <PizzaConfetti count={25} />
          <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
            <div className="flex gap-3">
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
            <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
          </div>
        </>
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
        <>
          <PizzaConfetti count={25} />
          <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
            <div className="flex gap-3">
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
            <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
          </div>
        </>
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const steps = [
    {
      title: "Fractions to Decimals",
      content: "Let's learn a secret code for pizza slices — decimals! 🍕",
      visual: "intro"
    },
    {
      title: "Pizza Tenths!",
      content: "Imagine cutting a pizza into 10 tiny equal slices. Each slice is one TENTH of the pizza. We write one slice as 0.1!",
      visual: "tenths"
    },
    {
      title: "Half a Pizza = 0.5",
      content: "If you eat 5 out of 10 slices, you ate HALF the pizza! So 1/2 = 5/10 = 0.5!",
      visual: "half"
    },
    {
      title: "Quarter Pizza = 0.25",
      content: "One quarter of a pizza (1/4) is the same as 0.25. That's like 2 and a half slices out of 10!",
      visual: "quarter"
    },
    {
      title: "Your Turn!",
      content: "What decimal equals 3/4 of a pizza?",
      visual: "interactive"
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
      setSelectedAnswer(null);
      if (step === steps.length - 2) {
        completeLesson('lesson4');
        addStars(3);
        playSound('complete');
      }
    } else {
      setCurrentScreen('home');
    }
  };

  const renderPizzaFraction = (numerator, denominator, size = 'w-48 h-48') => {
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
          <div className="text-9xl animate-bounce">🔢</div>
        </div>
      );
    }

    if (currentStep.visual === "tenths") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            {renderPizzaFraction(1, 10, 'w-56 h-56')}
          </div>
          <div className="flex items-center justify-center gap-4 text-5xl font-bold">
            <span className="text-purple-600">1/10</span>
            <span className="text-gray-400">=</span>
            <span className="text-green-600">0.1</span>
          </div>
          <div className="bg-purple-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-purple-800">
              Each tiny slice is one tenth! Count them: 0.1, 0.2, 0.3... all the way to 1.0 for the whole pizza!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "half") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              {renderPizzaFraction(1, 2, 'w-40 h-40')}
              <p className="text-3xl font-bold text-purple-600 mt-3">1/2</p>
            </div>
            <div className="text-4xl font-bold text-gray-400">=</div>
            <div className="text-center">
              {renderPizzaFraction(5, 10, 'w-40 h-40')}
              <p className="text-3xl font-bold text-purple-600 mt-3">5/10</p>
            </div>
            <div className="text-4xl font-bold text-gray-400">=</div>
            <div className="text-center">
              <div className="w-40 h-40 border-8 border-green-500 rounded-2xl flex items-center justify-center bg-white">
                <p className="text-5xl font-bold text-green-600">0.5</p>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-3">Half!</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-green-800">
              5 slices out of 10 = half the pizza! 1/2 = 5/10 = 0.5 — they're all the same!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "quarter") {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              {renderPizzaFraction(1, 4, 'w-48 h-48')}
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
          <div className="bg-blue-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-blue-800">
              One quarter of a pizza = 0.25. If each slice of a 4-slice pizza is worth 0.25, you can count them up!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "interactive") {
      const options = ['0.75', '0.34', '0.50'];

      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            {renderPizzaFraction(3, 4, 'w-52 h-52')}
          </div>
          <p className="text-4xl font-bold text-center text-purple-600">3/4 = ?</p>

          <div className="bg-purple-100 rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-lg text-center text-purple-800">
              Hint: Each slice is worth 0.25. Count: 0.25... 0.50... 0.75!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelectedAnswer(option);
                  if (option === '0.75') {
                    playSound('correct');
                  } else {
                    playSound('wrong');
                  }
                }}
                disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-3xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === '0.75'
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-red-500 text-white scale-95'
                    : selectedAnswer !== null && option === '0.75'
                      ? 'bg-green-300 text-white'
                      : 'bg-white text-purple-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer === '0.75' && (
            <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-green-800 font-bold">
                ✓ Excellent! 3/4 = 0.75! Three quarters of the pizza!
              </p>
            </div>
          )}

          {selectedAnswer && selectedAnswer !== '0.75' && (
            <div className="bg-orange-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-orange-800 font-bold">
                Not quite! Count the quarter slices: 0.25... 0.50... 0.75!
              </p>
            </div>
          )}
        </div>
      );
    }

    if (currentStep.visual === "complete") {
      return (
        <>
          <PizzaConfetti count={25} />
          <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
            <div className="flex gap-3">
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
            <p className="text-2xl font-bold text-purple-600">+3 Stars!</p>
          </div>
        </>
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
            disabled={step === 4 && selectedAnswer !== '0.75'}
            className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-3 ${
              step === 4 && selectedAnswer !== '0.75' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === steps.length - 1 ? 'Finish!' : step === 4 && selectedAnswer !== '0.75' ? 'Pick the right answer!' : 'Next'}
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
        <PizzaConfetti count={30} />
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

const LessonFive = ({ setCurrentScreen, completeLesson, addStars, playSound }) => {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const steps = [
    {
      title: "Adding Different Fractions",
      content: "What happens when we add fractions with DIFFERENT bottom numbers? Let's find out! 🍕",
      visual: "intro"
    },
    {
      title: "The Problem",
      content: "What is 1/2 + 1/3? The pizza slices are different sizes, so we can't just add them!",
      visual: "problem"
    },
    {
      title: "Re-cut the Pizza!",
      content: "We need to re-cut both pizzas so all slices are the SAME size. We can cut them both into 6 equal slices!",
      visual: "recut"
    },
    {
      title: "Now We Can Add!",
      content: "1/2 = 3/6 and 1/3 = 2/6. Now we can add: 3/6 + 2/6 = 5/6!",
      visual: "solution"
    },
    {
      title: "Your Turn!",
      content: "What is 1/2 + 1/4? (Hint: re-cut the 1/2 pizza into quarters!)",
      visual: "interactive"
    },
    {
      title: "Amazing!",
      content: "You can add fractions with different bottom numbers! ⭐",
      visual: "complete"
    }
  ];

  const nextStep = () => {
    playSound('click');
    if (step < steps.length - 1) {
      setStep(step + 1);
      setSelectedAnswer(null);
      if (step === steps.length - 2) {
        completeLesson('lesson5');
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
          <div className="text-8xl animate-bounce">🍕➕🍕</div>
        </div>
      );
    }

    if (currentStep.visual === "problem") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              {renderPizzaFraction(1, 2, 'w-40 h-40')}
              <p className="text-3xl font-bold text-teal-600 mt-3">1/2</p>
              <p className="text-sm text-gray-500">2 big slices</p>
            </div>
            <div className="text-4xl font-bold text-teal-500">+</div>
            <div className="text-center">
              {renderPizzaFraction(1, 3, 'w-40 h-40')}
              <p className="text-3xl font-bold text-teal-600 mt-3">1/3</p>
              <p className="text-sm text-gray-500">3 medium slices</p>
            </div>
            <div className="text-4xl font-bold text-gray-400">=</div>
            <div className="text-6xl">❓</div>
          </div>
          <div className="bg-red-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-red-800">
              The slices are different sizes! We can't just add 1 + 1 because they're not the same kind of slice.
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "recut") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-gray-500">Before:</p>
              {renderPizzaFraction(1, 2, 'w-32 h-32')}
              <p className="text-2xl font-bold text-teal-600">1/2</p>
            </div>
            <div className="text-3xl font-bold text-teal-500">→</div>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-green-600">After:</p>
              {renderPizzaFraction(3, 6, 'w-32 h-32')}
              <p className="text-2xl font-bold text-green-600">3/6</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-gray-500">Before:</p>
              {renderPizzaFraction(1, 3, 'w-32 h-32')}
              <p className="text-2xl font-bold text-teal-600">1/3</p>
            </div>
            <div className="text-3xl font-bold text-teal-500">→</div>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-green-600">After:</p>
              {renderPizzaFraction(2, 6, 'w-32 h-32')}
              <p className="text-2xl font-bold text-green-600">2/6</p>
            </div>
          </div>
          <div className="bg-teal-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-teal-800">
              Now all slices are the same size (sixths)! We re-cut the pizza so we can add them!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "solution") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              {renderPizzaFraction(3, 6, 'w-36 h-36')}
              <p className="text-2xl font-bold text-teal-600 mt-3">3/6</p>
            </div>
            <div className="text-4xl font-bold text-teal-500">+</div>
            <div className="text-center">
              {renderPizzaFraction(2, 6, 'w-36 h-36')}
              <p className="text-2xl font-bold text-teal-600 mt-3">2/6</p>
            </div>
            <div className="text-4xl font-bold text-gray-400">=</div>
            <div className="text-center">
              {renderPizzaFraction(5, 6, 'w-36 h-36')}
              <p className="text-2xl font-bold text-green-600 mt-3">5/6</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-xl text-center text-green-800">
              3 + 2 = 5, so 3/6 + 2/6 = 5/6! Almost the whole pizza!
            </p>
          </div>
        </div>
      );
    }

    if (currentStep.visual === "interactive") {
      const options = ['3/4', '2/6', '1/3'];

      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              {renderPizzaFraction(1, 2, 'w-40 h-40')}
              <p className="text-3xl font-bold text-teal-600 mt-3">1/2</p>
            </div>
            <div className="text-4xl font-bold text-teal-500">+</div>
            <div className="text-center">
              {renderPizzaFraction(1, 4, 'w-40 h-40')}
              <p className="text-3xl font-bold text-teal-600 mt-3">1/4</p>
            </div>
            <div className="text-4xl font-bold text-gray-400">=</div>
            <div className="text-6xl">❓</div>
          </div>

          <div className="bg-teal-100 rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-lg text-center text-teal-800">
              Hint: Re-cut 1/2 into quarters → 2/4. Then add: 2/4 + 1/4 = ?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelectedAnswer(option);
                  if (option === '3/4') {
                    playSound('correct');
                  } else {
                    playSound('wrong');
                  }
                }}
                disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-3xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === '3/4'
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-red-500 text-white scale-95'
                    : selectedAnswer !== null && option === '3/4'
                      ? 'bg-green-300 text-white'
                      : 'bg-white text-teal-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer === '3/4' && (
            <div className="bg-green-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-green-800 font-bold">
                ✓ Perfect! 1/2 + 1/4 = 2/4 + 1/4 = 3/4!
              </p>
            </div>
          )}

          {selectedAnswer && selectedAnswer !== '3/4' && (
            <div className="bg-orange-100 rounded-2xl p-6 max-w-2xl mx-auto animate-fadeIn">
              <p className="text-2xl text-center text-orange-800 font-bold">
                Not quite! Try re-cutting: 1/2 = 2/4, then 2/4 + 1/4 = ?
              </p>
            </div>
          )}
        </div>
      );
    }

    if (currentStep.visual === "complete") {
      return (
        <>
          <PizzaConfetti count={25} />
          <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
            <div className="flex gap-3">
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.2s'}} />
              <Star className="w-16 h-16 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
            <p className="text-2xl font-bold text-teal-600">+3 Stars!</p>
          </div>
        </>
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

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-teal-300">
        <div className="bg-teal-100 p-4">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  idx <= step ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-teal-600">
            {steps[step].title}
          </h2>
          <p className="text-2xl text-center mb-8 text-gray-700">
            {steps[step].content}
          </p>

          {renderVisual()}
        </div>

        <div className="bg-teal-50 p-6 flex justify-center">
          <button
            onClick={nextStep}
            disabled={step === 4 && selectedAnswer !== '3/4'}
            className={`bg-gradient-to-r from-teal-500 to-teal-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-3 ${
              step === 4 && selectedAnswer !== '3/4' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === steps.length - 1 ? 'Finish!' : step === 4 && selectedAnswer !== '3/4' ? 'Pick the right answer!' : 'Next'}
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddingFractionsGame = ({ setCurrentScreen, incrementGamesPlayed, addStars, playSound }) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = () => {
    const denominator = [3, 4, 6][Math.floor(Math.random() * 3)];
    const num1 = Math.floor(Math.random() * (denominator - 1)) + 1;
    const maxNum2 = denominator - num1;
    const num2 = Math.floor(Math.random() * maxNum2) + 1;
    const answerNum = num1 + num2;
    const correct = `${answerNum}/${denominator}`;

    const options = [correct];
    while (options.length < 3) {
      const fakeNum = Math.floor(Math.random() * denominator) + 1;
      const fake = `${fakeNum}/${denominator}`;
      if (!options.includes(fake)) options.push(fake);
    }
    options.sort(() => Math.random() - 0.5);

    return {
      num1, num2, denominator, correct, options,
      question: `What is ${num1}/${denominator} + ${num2}/${denominator}?`
    };
  };

  useEffect(() => { setCurrentQuestion(generateQuestion()); }, []);

  const renderPizzaFraction = (numerator, denominator) => {
    const pieces = Array.from({ length: denominator }, (_, i) => i);
    return (
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-yellow-600 shadow-xl">
          {pieces.map((piece) => {
            const angle = (360 / denominator) * piece;
            const isColored = piece < numerator;
            return (
              <div key={piece} className="absolute inset-0"
                style={{ clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/denominator) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/denominator) * Math.PI) / 180)}%)` }}>
                <div className={`w-full h-full ${isColored ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-yellow-200 to-yellow-300'}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct) {
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

  if (feedback === 'complete') {
    return (
      <div className="space-y-6">
        <PizzaConfetti count={30} />
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-orange-300">
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-5xl font-bold text-orange-600 mb-4">Awesome Job!</h2>
          <p className="text-3xl text-gray-700 mb-6">You scored {score} points!</p>
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: Math.min(5, Math.floor(score / 10)) }).map((_, i) => (
              <Star key={i} className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <button onClick={() => { playSound('click'); setCurrentScreen('home'); }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 border-4 border-orange-300">
        <button onClick={() => { playSound('click'); setCurrentScreen('home'); }}
          className="bg-gray-100 rounded-full px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200 transition">
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-orange-600">{score}</span>
          </div>
          <div className="text-xl font-semibold text-gray-600">Q {questionsAnswered + 1}/5</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-300">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6">
          <h2 className="text-4xl font-bold text-white text-center">{currentQuestion.question}</h2>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="text-center">
              {renderPizzaFraction(currentQuestion.num1, currentQuestion.denominator)}
              <p className="text-2xl font-bold text-orange-600 mt-2">{currentQuestion.num1}/{currentQuestion.denominator}</p>
            </div>
            <div className="text-4xl font-bold text-orange-500">+</div>
            <div className="text-center">
              {renderPizzaFraction(currentQuestion.num2, currentQuestion.denominator)}
              <p className="text-2xl font-bold text-orange-600 mt-2">{currentQuestion.num2}/{currentQuestion.denominator}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option) => (
              <button key={option} onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-3xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === currentQuestion.correct ? 'bg-green-500 text-white scale-105' : 'bg-red-500 text-white scale-95'
                    : 'bg-white text-orange-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
        {feedback && feedback !== 'complete' && (
          <div className={`p-6 text-center ${feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center justify-center gap-4">
              {feedback === 'correct' ? (
                <><Check className="w-12 h-12 text-green-600" /><span className="text-3xl font-bold text-green-600">Correct! 🎉</span></>
              ) : (
                <><X className="w-12 h-12 text-red-600" /><span className="text-3xl font-bold text-red-600">The answer was {currentQuestion.correct}</span></>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FractionFaceOff = ({ setCurrentScreen, incrementGamesPlayed, addStars, playSound }) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = () => {
    const types = ['same-den', 'same-num', 'different'];
    const type = types[Math.floor(Math.random() * types.length)];
    let frac1, frac2, correct;

    if (type === 'same-den') {
      const den = [3, 4, 6][Math.floor(Math.random() * 3)];
      const n1 = Math.floor(Math.random() * (den - 1)) + 1;
      let n2 = Math.floor(Math.random() * (den - 1)) + 1;
      while (n2 === n1) n2 = Math.floor(Math.random() * (den - 1)) + 1;
      frac1 = { num: n1, den };
      frac2 = { num: n2, den };
      correct = n1 > n2 ? `${n1}/${den}` : `${n2}/${den}`;
    } else if (type === 'same-num') {
      const num = [1, 2][Math.floor(Math.random() * 2)];
      const d1 = [2, 3, 4, 6][Math.floor(Math.random() * 4)];
      let d2 = [2, 3, 4, 6][Math.floor(Math.random() * 4)];
      while (d2 === d1) d2 = [2, 3, 4, 6][Math.floor(Math.random() * 4)];
      frac1 = { num, den: d1 };
      frac2 = { num, den: d2 };
      correct = d1 < d2 ? `${num}/${d1}` : `${num}/${d2}`;
    } else {
      const pairs = [
        [{ num: 2, den: 3 }, { num: 1, den: 4 }, '2/3'],
        [{ num: 3, den: 4 }, { num: 1, den: 3 }, '3/4'],
        [{ num: 1, den: 2 }, { num: 1, den: 3 }, '1/2'],
        [{ num: 2, den: 4 }, { num: 1, den: 3 }, '2/4'],
        [{ num: 3, den: 4 }, { num: 2, den: 3 }, '3/4'],
      ];
      const pick = pairs[Math.floor(Math.random() * pairs.length)];
      frac1 = pick[0];
      frac2 = pick[1];
      correct = pick[2];
    }

    if (Math.random() > 0.5) {
      [frac1, frac2] = [frac2, frac1];
    }

    const options = [`${frac1.num}/${frac1.den}`, `${frac2.num}/${frac2.den}`, "They're equal"];
    return { frac1, frac2, correct, options, question: 'Which fraction is BIGGER?' };
  };

  useEffect(() => { setCurrentQuestion(generateQuestion()); }, []);

  const renderPizzaFraction = (numerator, denominator) => {
    const pieces = Array.from({ length: denominator }, (_, i) => i);
    return (
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-yellow-600 shadow-xl">
          {pieces.map((piece) => {
            const angle = (360 / denominator) * piece;
            const isColored = piece < numerator;
            return (
              <div key={piece} className="absolute inset-0"
                style={{ clipPath: `polygon(50% 50%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, ${50 + 50 * Math.sin(((angle + 360/denominator) * Math.PI) / 180)}% ${50 - 50 * Math.cos(((angle + 360/denominator) * Math.PI) / 180)}%)` }}>
                <div className={`w-full h-full ${isColored ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-yellow-200 to-yellow-300'}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct) {
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

  if (feedback === 'complete') {
    return (
      <div className="space-y-6">
        <PizzaConfetti count={30} />
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-blue-300">
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-5xl font-bold text-blue-600 mb-4">Amazing!</h2>
          <p className="text-3xl text-gray-700 mb-6">You scored {score} points!</p>
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: Math.min(5, Math.floor(score / 10)) }).map((_, i) => (
              <Star key={i} className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <button onClick={() => { playSound('click'); setCurrentScreen('home'); }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 border-4 border-blue-300">
        <button onClick={() => { playSound('click'); setCurrentScreen('home'); }}
          className="bg-gray-100 rounded-full px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200 transition">
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-blue-600">{score}</span>
          </div>
          <div className="text-xl font-semibold text-gray-600">Q {questionsAnswered + 1}/5</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-300">
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6">
          <h2 className="text-4xl font-bold text-white text-center">{currentQuestion.question}</h2>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              {renderPizzaFraction(currentQuestion.frac1.num, currentQuestion.frac1.den)}
              <p className="text-3xl font-bold text-blue-600 mt-3">{currentQuestion.frac1.num}/{currentQuestion.frac1.den}</p>
            </div>
            <div className="text-5xl font-bold text-gray-400">vs</div>
            <div className="text-center">
              {renderPizzaFraction(currentQuestion.frac2.num, currentQuestion.frac2.den)}
              <p className="text-3xl font-bold text-blue-600 mt-3">{currentQuestion.frac2.num}/{currentQuestion.frac2.den}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option) => (
              <button key={option} onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === currentQuestion.correct ? 'bg-green-500 text-white scale-105' : 'bg-red-500 text-white scale-95'
                    : 'bg-white text-blue-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
        {feedback && feedback !== 'complete' && (
          <div className={`p-6 text-center ${feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center justify-center gap-4">
              {feedback === 'correct' ? (
                <><Check className="w-12 h-12 text-green-600" /><span className="text-3xl font-bold text-green-600">Correct! 🎉</span></>
              ) : (
                <><X className="w-12 h-12 text-red-600" /><span className="text-3xl font-bold text-red-600">It was {currentQuestion.correct}!</span></>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DecimalDash = ({ setCurrentScreen, incrementGamesPlayed, addStars, playSound }) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const conversions = [
    { fraction: '1/2', decimal: '0.5' },
    { fraction: '1/4', decimal: '0.25' },
    { fraction: '3/4', decimal: '0.75' },
    { fraction: '1/10', decimal: '0.1' },
    { fraction: '2/10', decimal: '0.2' },
    { fraction: '5/10', decimal: '0.5' },
    { fraction: '1/5', decimal: '0.2' },
    { fraction: '2/5', decimal: '0.4' },
    { fraction: '3/5', decimal: '0.6' },
    { fraction: '4/5', decimal: '0.8' },
  ];

  const allDecimals = ['0.1', '0.2', '0.25', '0.4', '0.5', '0.6', '0.75', '0.8'];
  const allFractions = ['1/2', '1/4', '3/4', '1/10', '2/10', '1/5', '2/5', '3/5', '4/5'];

  const generateQuestion = () => {
    const conv = conversions[Math.floor(Math.random() * conversions.length)];
    const toDecimal = Math.random() > 0.5;

    if (toDecimal) {
      const correct = conv.decimal;
      const options = [correct];
      while (options.length < 3) {
        const fake = allDecimals[Math.floor(Math.random() * allDecimals.length)];
        if (!options.includes(fake)) options.push(fake);
      }
      options.sort(() => Math.random() - 0.5);
      return { question: `What is ${conv.fraction} as a decimal?`, correct, options };
    } else {
      const correct = conv.fraction;
      const options = [correct];
      while (options.length < 3) {
        const fake = allFractions[Math.floor(Math.random() * allFractions.length)];
        if (!options.includes(fake)) options.push(fake);
      }
      options.sort(() => Math.random() - 0.5);
      return { question: `What fraction is ${conv.decimal}?`, correct, options };
    }
  };

  useEffect(() => { setCurrentQuestion(generateQuestion()); }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct) {
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

  if (feedback === 'complete') {
    return (
      <div className="space-y-6">
        <PizzaConfetti count={30} />
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-purple-300">
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-5xl font-bold text-purple-600 mb-4">Super Star!</h2>
          <p className="text-3xl text-gray-700 mb-6">You scored {score} points!</p>
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: Math.min(5, Math.floor(score / 10)) }).map((_, i) => (
              <Star key={i} className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <button onClick={() => { playSound('click'); setCurrentScreen('home'); }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 border-4 border-purple-300">
        <button onClick={() => { playSound('click'); setCurrentScreen('home'); }}
          className="bg-gray-100 rounded-full px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200 transition">
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <span className="text-2xl font-bold text-purple-600">{score}</span>
          </div>
          <div className="text-xl font-semibold text-gray-600">Q {questionsAnswered + 1}/5</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300">
        <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6">
          <h2 className="text-4xl font-bold text-white text-center">Decimal Dash!</h2>
        </div>
        <div className="p-8">
          <p className="text-3xl font-bold text-center text-purple-600 mb-8">{currentQuestion.question}</p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {currentQuestion.options.map((option) => (
              <button key={option} onClick={() => handleAnswer(option)} disabled={selectedAnswer !== null}
                className={`py-6 rounded-2xl text-3xl font-bold shadow-lg transform transition ${
                  selectedAnswer === option
                    ? option === currentQuestion.correct ? 'bg-green-500 text-white scale-105' : 'bg-red-500 text-white scale-95'
                    : 'bg-white text-purple-600 hover:scale-105 hover:shadow-xl'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
        {feedback && feedback !== 'complete' && (
          <div className={`p-6 text-center ${feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center justify-center gap-4">
              {feedback === 'correct' ? (
                <><Check className="w-12 h-12 text-green-600" /><span className="text-3xl font-bold text-green-600">Correct! 🎉</span></>
              ) : (
                <><X className="w-12 h-12 text-red-600" /><span className="text-3xl font-bold text-red-600">It was {currentQuestion.correct}</span></>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionsApp;