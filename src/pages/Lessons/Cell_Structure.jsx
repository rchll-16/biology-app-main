import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import organelleData from './components/organelleData'; // Import organelle data from a separate file
import Spinner from './components/Spinner'; // Create a Spinner component for loading state

// Image imports
import ElectronMicroscope from '../../assets/images/electron_microscope.png';
import CompoundMicroscope from '../../assets/images/compound_microscope.png';
import AnimalCell from '../../assets/images/animal_cell.png';
import PlantCell from '../../assets/images/plant_cell.png';

function Cell_Structure() {
  const navigate = useNavigate();
  const resolvedUsername = localStorage.getItem('username');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);
  const [showMicroscopeInfo, setShowMicroscopeInfo] = useState({ compound: false, electron: false });
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
        const lessonRef = ref(database, `users/${resolvedUsername}/completedLessons/lesson3`);
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
        [`users/${resolvedUsername}/completedLessons/lesson3`]: { completed: true },
        [`users/${resolvedUsername}/completedLessons/lesson4`]: { unlocked: true },
      };

      await update(ref(database), updates);
      setAlreadyCompleted(true);
      navigate('/activity2', { state: { quizCompleted: true, lessonID: 'lesson3' } });
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('❌ Something went wrong. Please try again later.');
    }
  };

  const handleGoToLesson = () => {
    navigate('/lesson');
  };

  const handleOrganelleClick = (index) => {
    setSelectedOrganelle(index);
  };

  const toggleMicroscopeInfo = (microscopeType) => {
    setShowMicroscopeInfo(prevState => ({
      ...prevState,
      [microscopeType]: !prevState[microscopeType]
    }));
  };

  const microscopeVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Use a spinner component for loading */}
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6 max-w-6xl text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">Cell Structure and Functions</h1>
      <p className="mb-6 leading-relaxed">
        The detailed structure of a cell has been studied under compound microscope and electron microscope... Click on the info icon to learn more!
      </p>

      {/* Microscope Images */}
      <motion.div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 md:mb-10">
        <MicroscopeCard
          image={CompoundMicroscope}
          title="Compound Microscope"
          info="Compound microscopes use visible light and lenses to magnify objects. They are commonly used in classrooms and labs."
          showInfo={showMicroscopeInfo.compound}
          toggleInfo={() => toggleMicroscopeInfo('compound')}
          variants={microscopeVariants}
        />
        <MicroscopeCard
          image={ElectronMicroscope}
          title="Electron Microscope"
          info="Electron microscopes use beams of electrons to magnify objects. They provide much higher resolution than light microscopes."
          showInfo={showMicroscopeInfo.electron}
          toggleInfo={() => toggleMicroscopeInfo('electron')}
          variants={microscopeVariants}
          delay={0.2}
        />
      </motion.div>

      {/* Animal and Plant Cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8 md:mb-10">
        <CellImage title="Animal Cell" image={AnimalCell} />
        <CellImage title="Plant Cell" image={PlantCell} />
      </div>

      {/* Lesson Outline */}
      <p className="mb-4 leading-relaxed">If we study a cell under a microscope, we would come across three features in almost every cell: plasma membrane, nucleus and cytoplasm. All activities inside the cell with its environment are possible due to these features. Click on the organelles below to explore their functions!</p>

      {/* Organelle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {organelleData.map((organelle, index) => (
          <OrganelleCard
            key={index}
            organelle={organelle}
            onClick={() => handleOrganelleClick(index)}
          />
        ))}
      </div>

      {/* Selected Organelle Details */}
      <AnimatePresence>
        {selectedOrganelle !== null && (
          <motion.div
            className="mt-8 p-6 bg-blue-50 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-4">{organelleData[selectedOrganelle].title}</h3>
            <p className="font-bold">Description:</p>
            <ul className="list-disc pl-5 mb-2 leading-relaxed">
              {organelleData[selectedOrganelle].description.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <p className="font-bold">Functions:</p>
            <ul className="list-disc pl-5 leading-relaxed">
              {organelleData[selectedOrganelle].functions.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video */}
      <div className="mt-16 md:mt-20">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-4">Watch: Cell Structure Overview</h2>
        <div className="relative pb-[56.25%] h-0 overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/URUJD5NEXC8"
            title="Cell Structure Overview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

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
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration"
        >
          Go to Lesson
        </button>
      </div>
    </motion.div>
  );
}

// Reusable component for microscope cards
const MicroscopeCard = ({ image, title, info, showInfo, toggleInfo, variants, delay }) => (
  <motion.div
    className="flex flex-col items-center cursor-pointer"
    variants={variants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
  >
    <img src={image} alt={title} className="w-40 md:w-56 h-auto mb-2" />
    <p className="text-sm md:text-base">{title}
      <FontAwesomeIcon
        icon={faInfoCircle}
        className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          toggleInfo();
        }}
      />
    </p>
    <AnimatePresence>
      {showInfo && (
        <motion.div
          className="mt-2 p-3 bg-gray-100 rounded-md shadow-sm text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {info}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Reusable component for cell images
const CellImage = ({ title, image }) => (
  <div className="text-center">
    <h2 className="text-lg md:text-xl font-semibold mb-2">{title}</h2>
    <img src={image} alt={title} className="mx-auto max-w-full md:max-w-lg" />
  </div>
);

// Reusable component for organelle cards
const OrganelleCard = ({ organelle, onClick }) => (
  <motion.div
    className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
  >
    <img src={organelle.img} alt={organelle.title} className="mx-auto h-28 w-28 object-contain mb-2" />
    <h3 className="text-md font-semibold text-center text-blue-700">{organelle.title}</h3>
  </motion.div>
);

export default Cell_Structure;
