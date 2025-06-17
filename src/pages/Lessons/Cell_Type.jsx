import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './components/Spinner'; // Create a Spinner component for loading state
import cellTypeData from './components/cellTypeData'; // Import cell type data from a separate file

function Cell_Type() {
  const navigate = useNavigate();
  const resolvedUsername = localStorage.getItem('username');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [selectedCellType, setSelectedCellType] = useState(null);
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
        const lessonRef = ref(database, `users/${resolvedUsername}/completedLessons/lesson5`);
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
        [`users/${resolvedUsername}/completedLessons/lesson5`]: { completed: true },
        [`users/${resolvedUsername}/completedLessons/lesson6`]: { unlocked: true },
      };

      await update(ref(database), updates);
      setAlreadyCompleted(true);
      navigate('/activity4', { state: { quizCompleted: true, lessonID: 'lesson5' } });
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('❌ Something went wrong. Please try again later.');
    }
  };

  const handleGoToLesson = () => {
    navigate('/lesson');
  };

  const handleCellTypeClick = (index) => {
    setSelectedCellType(index);
  };

  // Loading indicator
  if (loading) {
    return <Spinner />;
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 text-center md:text-left">
        Cell Types
      </h1>
      <p className="mt-4 md:mt-6 text-lg md:text-xl leading-relaxed text-gray-700">
        Cells are the basic building blocks of all living organisms. There are two main types of cells:
        prokaryotic and eukaryotic. Eukaryotic cells are more complex, with a
        true nucleus and specialized organelles, and make up plants, animals, fungi, and protists.
        Explore the different types of eukaryotic cells below!
      </p>

      {/* Cell Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cellTypeData.map((cell, index) => (
          <CellTypeCard
            key={index}
            cell={cell}
            isSelected={selectedCellType === index}
            onClick={() => handleCellTypeClick(index)}
          />
        ))}
      </div>

      {/* Selected Cell Type Details */}
      <AnimatePresence>
        {selectedCellType !== null && (
          <CellTypeDetails cell={cellTypeData[selectedCellType]} />
        )}
      </AnimatePresence>

      {/* Video */}
      <VideoSection />

      {/* Completion Button */}
      <div className="mt-8 md:mt-10 text-center">
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

// Reusable component for cell type cards
const CellTypeCard = ({ cell, isSelected, onClick }) => (
  <motion.div
    className={`relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 ${isSelected ? 'ring-4 ring-blue-500' : ''}`}
    onClick={onClick}
    whileHover={{ y: -5 }}
  >
    <img src={cell.image} alt={cell.type} className="w-full h-64 object-cover object-center" />
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-4">
      <h3 className="text-xl font-semibold">{cell.type}</h3>
    </div>
  </motion.div>
);

// Reusable component for selected cell type details
const CellTypeDetails = ({ cell }) => (
  <motion.div
    className="mt-12 p-6 bg-white rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex flex-col md:flex-row items-center">
      <img
        src={cell.image}
        alt={cell.type}
        className="w-full md:w-96 mb-4 md:mb-0 rounded-lg"
      />
      <div className="md:ml-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">{cell.type}</h2>
        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
          {cell.description}
        </p>
        <p className="mt-4 text-gray-800 italic">
          💡 Fun Fact: {cell.fact}
        </p>
      </div>
    </div>
  </motion.div>
);

// Reusable component for video section
const VideoSection = () => (
  <section className="mt-12 md:mt-16">
    <h2 className="text-xl font-semibold text-center mb-4">Watch: Cell Structure Overview</h2>
    <div className="relative pb-[56.25%] h-0 overflow-hidden">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
        src="https://www.youtube.com/embed/192M4oDLTdc"
        title="Cell Structure Overview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </section>
);

export default Cell_Type;
