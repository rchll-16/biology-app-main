import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './components/Spinner'; // Create a Spinner component for loading state
import organismData from './components/organismData'; // Import organism data from a separate file

import cellTheoryImage from '../../assets/images/cells.png';

const CellTheory = () => {
  const navigate = useNavigate();
  const resolvedUsername = localStorage.getItem('username');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [selectedOrganismType, setSelectedOrganismType] = useState(null);
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
        const lessonRef = ref(database, `users/${resolvedUsername}/completedLessons/lesson2`);
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

  const handleComplete = async () => {
    if (!resolvedUsername) {
      alert('⚠️ You must be logged in to access this lesson.');
      return;
    }

    try {
      const updates = {
        [`users/${resolvedUsername}/completedLessons/lesson2`]: { completed: true },
        [`users/${resolvedUsername}/completedLessons/lesson3`]: { unlocked: true },
      };

      await update(ref(database), updates);
      setAlreadyCompleted(true);
      navigate('/activity1', { state: { quizCompleted: true, lessonID: 'lesson2' } });
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('❌ Something went wrong. Please try again later.');
    }
  };

  const handleGoToLesson = () => {
    navigate('/lesson');
  };

  const handleOrganismTypeClick = (type) => {
    setSelectedOrganismType(type);
  };

  // Loading indicator
  if (loading) {
    return <Spinner />;
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6 bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">Cell Theory</h1>

      {/* Overview */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src={cellTheoryImage}
          alt="Cell"
          className="w-full md:w-1/2 object-cover rounded-xl shadow-md"
        />
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-2">What is a Cell?</h2>
          <p className="mb-2 leading-relaxed">A cell is the basic structural and functional unit of living organisms.</p>
          <p className="leading-relaxed">In other words, cells make up living things and carry out activities that keep them alive.</p>
        </div>
      </motion.div>

      {/* Cell Theory Points */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="mb-2 leading-relaxed">
          Cell Theory is a collection of conclusions from many scientists that describe cells and how they work.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li className="leading-relaxed">All known living things are made up of one or more cells.</li>
          <li className="leading-relaxed">All living cells arise from pre-existing cells by division.</li>
          <li className="leading-relaxed">The cell is the basic unit of structure and function in all living organisms.</li>
        </ol>
        <div className="my-4 text-center">
          <a
            href="https://en.wikipedia.org/wiki/Cell_theory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-100 border border-blue-400 px-4 py-2 rounded hover:bg-blue-200 font-medium transition"
          >
            Learn More on Wikipedia
          </a>
        </div>
      </motion.div>

      {/* Timeline */}
      <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4">Cell Theory Timeline</h2>
      <motion.ul
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {[
          { year: "1665", name: "Robert Hooke", desc: 'Coined the term "cell" after observing cork under a microscope.' },
          { year: "1674", name: "Anton van Leeuwenhoek", desc: "Observed living cells like bacteria and protozoa." },
          { year: "1831", name: "Robert Brown", desc: "Discovered the nucleus inside plant cells." },
          { year: "1838", name: "Matthias Schleiden", desc: "Concluded all plants are made of cells." },
          { year: "1839", name: "Theodor Schwann", desc: "Stated all animals are made of cells." },
          { year: "1855", name: "Rudolf Virchow", desc: 'Proposed all cells come from pre-existing cells ("Omnis cellula e cellula").' }
        ].map((item, idx) => (
          <li key={idx}>
            <p className="font-semibold text-gray-700">📅 {item.year} – {item.name}</p>
            <p className="ml-4 leading-relaxed">{item.desc}</p>
          </li>
        ))}
      </motion.ul>

      {/* Organism Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center mb-4">Explore Organisms</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleOrganismTypeClick('unicellular')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              selectedOrganismType === 'unicellular' ? 'bg-green-200 text-green-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            } transition duration-300`}
          >
            Unicellular
          </button>
          <button
            onClick={() => handleOrganismTypeClick('multicellular')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              selectedOrganismType === 'multicellular' ? 'bg-green-200 text-green-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            } transition duration-300`}
          >
            Multicellular
          </button>
        </div>
      </div>

      {/* Unicellular Organisms */}
      <AnimatePresence>
        {selectedOrganismType === 'unicellular' && (
          <OrganismSection title="Unicellular Organisms" organisms={organismData.unicellular} />
        )}
      </AnimatePresence>

      {/* Multicellular Organisms */}
      <AnimatePresence>
        {selectedOrganismType === 'multicellular' && (
          <OrganismSection title="Multicellular Organisms" organisms={organismData.multicellular} />
        )}
      </AnimatePresence>

      {/* Video */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-xl font-bold text-center mb-4">Watch: Cell Theory Explained</h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-full rounded-xl shadow-md"
            src="https://www.youtube.com/embed/-mPReow5Sjg"
            title="Cell Theory Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>

      {/* Complete Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleComplete}
          disabled={alreadyCompleted}
          className={`${
            alreadyCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 mr-4`}
        >
          {alreadyCompleted ? '✅ Completed' : 'Start Activity'}
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
};

// Reusable component for organism sections
const OrganismSection = ({ title, organisms }) => (
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
    <p className="text-center mb-4 leading-relaxed">Click on an organism to learn a fun fact!</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {organisms.map((org, idx) => (
        <div key={idx} className="text-center">
          <img
            src={org.src}
            alt={org.name}
            className="w-full h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={() => alert(org.fact)}
          />
          <p className="mt-2 font-medium">{org.name}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default CellTheory;
