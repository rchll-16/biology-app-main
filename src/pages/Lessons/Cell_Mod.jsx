import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import cellData from './components/cellData'; // Import cell data from a separate file
import Spinner from './components/Spinner'; // Create a Spinner component for loading state

function Cell_Mod() {
  const navigate = useNavigate();
  const resolvedUsername = localStorage.getItem('username');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showFact, setShowFact] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resolvedUsername) {
      alert('⚠️ You must be logged in to access this lesson.');
      navigate('/login');
      return;
    }

    const checkCompletion = async () => {
      setLoading(true);
      try {
        const lessonRef = ref(database, `users/${resolvedUsername}/completedLessons/lesson6`);
        const snapshot = await get(lessonRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAlreadyCompleted(data.completed === true);
        } else {
          setAlreadyCompleted(false);
        }
      } catch (error) {
        console.error('Error checking completion:', error);
        alert('❌ Failed to load completion status. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkCompletion();
  }, [resolvedUsername, navigate]);

  const handleStartActivity = async () => {
    if (!resolvedUsername) {
      alert('⚠️ You must be logged in to access this activity.');
      return;
    }

    try {
      const updates = {
        [`users/${resolvedUsername}/completedLessons/lesson6`]: { completed: true },
        [`users/${resolvedUsername}/completedLessons/lesson7`]: { unlocked: true },
      };

      await update(ref(database), updates);
      setAlreadyCompleted(true);
      navigate('/activity5', { state: { quizCompleted: true, lessonID: 'lesson6' } });
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('❌ Something went wrong. Please try again later.');
    }
  };

  const handleGoToLesson = () => {
    navigate('/lesson');
  };

  const handleCellClick = (index) => {
    setSelectedCell(index);
    setShowFact(false);
  };

  const handleFactToggle = () => {
    setShowFact(!showFact);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Use a spinner component for loading */}
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4 text-center md:text-left">
        Cell Modifications
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed">
        Cells are not all alike—many undergo structural modifications to perform specialized functions more effectively. Explore the fascinating adaptations of different cell types! Click on a cell to learn more.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cellData.map((cell, index) => (
          <motion.div
            key={index}
            className={`relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 ${
              selectedCell === index ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => handleCellClick(index)}
            whileHover={{ y: -5 }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleCellClick(index)} // Accessibility
          >
            <img src={cell.image} alt={cell.name} className="w-full h-64 object-cover object-center" />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-4">
              <h3 className="text-xl font-semibold">{cell.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCell !== null && (
          <motion.div
            className="mt-12 p-6 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={cellData[selectedCell].image}
                alt={cellData[selectedCell].name}
                className="w-full md:w-96 mb-4 md:mb-0 rounded-lg"
              />
              <div className="md:ml-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">{cellData[selectedCell].name}</h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {cellData[selectedCell].description}
                </p>
                <button
                  onClick={handleFactToggle}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  {showFact ? 'Hide Fun Fact' : 'Show Fun Fact'}
                </button>
                {showFact && (
                  <motion.p
                    className="mt-4 text-gray-800 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    💡 Did you know? {cellData[selectedCell].fact}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 text-center">
        <button
          onClick={handleStartActivity}
          disabled={alreadyCompleted}
          className={`${
            alreadyCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 mr-4`}
        >
          {alreadyCompleted ? '✅ Completed' : 'Take the Activity'}
        </button>
        <button
          onClick={handleGoToLesson}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Go to Lesson
        </button>
      </div>
    </motion.div>
  );
}

export default Cell_Mod;
