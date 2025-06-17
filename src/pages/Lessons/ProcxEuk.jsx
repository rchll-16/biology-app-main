import React, { useEffect, useState } from 'react';
import ProcxEuk from '../../assets/images/prokxeuk.png';
import ProkDiagram from '../../assets/images/prok_diagram.png';
import EukDiagram from '../../assets/images/euk_diagram.png';
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export const cellComparisonTable = {
  headers: ['Feature', 'Prokaryotic Cells', 'Eukaryotic Cells'],
  rows: [
    ['Nucleus', 'No nucleus', 'Has nucleus'],
    ['Size', 'Small (1-10 µm)', 'Larger (10-100 µm)'],
    ['Complexity', 'Simple', 'Complex'],
    ['Examples', 'Bacteria, Archaea', 'Animals, Plants, Fungi, Protists'],
    ['Organelles', 'No membrane-bound organelles', 'Has membrane-bound organelles'],
    ['DNA Location', 'Floating freely in cytoplasm', 'Inside the nucleus'],
    ['Cell Division', 'Binary fission', 'Mitosis or meiosis'],
  ],
};

function Activity2() {
  const navigate = useNavigate();
  const resolvedUsername = localStorage.getItem('username');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [showProkaryotes, setShowProkaryotes] = useState(false);
  const [showEukaryotes, setShowEukaryotes] = useState(false);
  const [showSimilarities, setShowSimilarities] = useState(false);
  const [showDifferences, setShowDifferences] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resolvedUsername) {
      alert('⚠️ You must be logged in to access this lesson.');
      navigate('/login');
      return;
    }

    async function checkCompletion() {
      setLoading(true);
      try {
        const lessonRef = ref(database, `users/${resolvedUsername}/completedLessons/lesson4`);
        const snapshot = await get(lessonRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAlreadyCompleted(data.completed === true);
        } else {
          setAlreadyCompleted(false);
        }
      } catch (error) {
        console.error('Error checking completion:', error);
        alert('❌ Failed to load completion status. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    checkCompletion();
  }, [resolvedUsername, navigate]);

  const handleStartActivity = async () => {
    if (!resolvedUsername) {
      alert('⚠️ You must be logged in to access this activity.');
      return;
    }
    try {
      const updates = {};
      updates[`users/${resolvedUsername}/completedLessons/lesson4`] = { completed: true };
      updates[`users/${resolvedUsername}/completedLessons/lesson5`] = { unlocked: true };

      await update(ref(database), updates);
      setAlreadyCompleted(true);
      navigate('/activity3', { state: { quizCompleted: true, lessonID: 'lesson4' } });
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('❌ Something went wrong. Please try again.');
    }
  };

  const handleGoToLesson = () => {
    navigate('/lesson');
  };

  const SectionHeader = ({ title, showInfo, setShowInfo }) => (
    <h2
      role="button"
      tabIndex={0}
      onClick={() => setShowInfo(!showInfo)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setShowInfo(!showInfo);
        }
      }}
      className="text-3xl md:text-4xl text-blue-600 font-bold mb-4 cursor-pointer flex items-center justify-between p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition duration-300 select-none"
      aria-expanded={showInfo}
      aria-controls={`${title.replace(/\s+/g, '-').toLowerCase()}-content`}
    >
      {title}
      <FontAwesomeIcon icon={showInfo ? faChevronUp : faChevronDown} className="ml-2 text-xl" />
    </h2>
  );

  const handleVideoError = () => {
    setVideoError(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl text-blue-600 font-bold mb-6 text-center">
        Prokaryotic vs Eukaryotic Cells
      </h1>

      <motion.div
        className="flex flex-col items-center mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img
          src={ProcxEuk}
          alt="Diagram comparing Prokaryotic and Eukaryotic cells"
          className="w-full md:w-4/5 lg:w-96 shadow-lg rounded-md"
        />
        <p className="mt-6 md:mt-8 text-center max-w-3xl leading-relaxed">
          Prokaryotic and eukaryotic cells are the basic units of life on Earth. The key distinction is that prokaryotes lack a membrane-bound nucleus and organelles. Both types of cells have cytoplasm, a cell membrane, and ribosomes for protein synthesis.
        </p>
      </motion.div>

      <motion.div
        className="bg-white shadow-md rounded-lg overflow-x-auto mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {cellComparisonTable.headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="py-3 px-4 md:px-6 border-b border-gray-300 text-gray-800 font-bold uppercase text-sm text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cellComparisonTable.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-300">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-4 md:px-6 text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Prokaryotes Section */}
      <motion.section
        className="mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SectionHeader title="Prokaryotes" showInfo={showProkaryotes} setShowInfo={setShowProkaryotes} />
        <AnimatePresence>
          {showProkaryotes && (
            <motion.div
              className="p-4 bg-gray-50 rounded-md shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={ProkDiagram}
                  alt="Prokaryotic Cell Diagram"
                  className="w-full md:w-1/2 rounded-md shadow-md mb-4 md:mb-0 md:mr-4"
                />
                <div>
                  <p className="leading-relaxed">
                    Prokaryotes are unicellular organisms without membrane-bound structures like a nucleus or organelles.
                  </p>
                  <p className="leading-relaxed">
                    They are generally small and simple, with a single circular chromosome located in the nucleoid region. Plasmids carry extra DNA.
                  </p>
                  <h3 className="mt-4 font-semibold">Key features of prokaryotes:</h3>
                  <ul className="list-disc list-inside ml-4 leading-relaxed">
                    <li><strong>Capsule:</strong> Helps bacteria stick to surfaces</li>
                    <li><strong>Cell wall:</strong> Provides structure and protection</li>
                    <li><strong>Cell membrane:</strong> Encloses cytoplasm</li>
                    <li><strong>Cytoplasm:</strong> Gel-like substance inside the cell</li>
                    <li><strong>Nucleoid:</strong> Region containing DNA</li>
                    <li><strong>Plasmids:</strong> Small DNA molecules</li>
                    <li><strong>Ribosomes:</strong> Site of protein synthesis</li>
                    <li><strong>Flagella:</strong> Tail-like structures for movement</li>
                    <li><strong>Pili:</strong> Short rods for attachment</li>
                    <li><strong>Fimbriae:</strong> Hair-like structures for attachment</li>
                    <li><strong>Vesicles:</strong> Membrane sacs with various functions</li>
                    <li><strong>Vacuoles:</strong> Storage sacs</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Eukaryotes Section */}
      <motion.section
        className="mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <SectionHeader title="Eukaryotes" showInfo={showEukaryotes} setShowInfo={setShowEukaryotes} />
        <AnimatePresence>
          {showEukaryotes && (
            <motion.div
              className="p-4 bg-gray-50 rounded-md shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={EukDiagram}
                  alt="Eukaryotic Cell Diagram"
                  className="w-full md:w-1/2 rounded-md shadow-md mb-4 md:mb-0 md:mr-4"
                />
                <div>
                  <p className="leading-relaxed">
                    Eukaryotic cells have a true nucleus and membrane-bound organelles. Examples include plant and animal cells.
                  </p>
                  <h3 className="mt-4 font-semibold">Key features of eukaryotes:</h3>
                  <ul className="list-disc list-inside ml-4 leading-relaxed">
                    <li><strong>Nucleus:</strong> Contains DNA and controls cell activities</li>
                    <li><strong>Nucleolus:</strong> Produces ribosomes and aids stress response</li>
                    <li><strong>Plasma membrane:</strong> Encloses the cell</li>
                    <li><strong>Cytoplasm:</strong> Area between nucleus and plasma membrane</li>
                    <li><strong>Cell wall:</strong> Supports plant, algae, and fungi cells</li>
                    <li><strong>Mitochondria:</strong> Produce ATP energy</li>
                    <li><strong>Chloroplasts:</strong> Capture energy for photosynthesis</li>
                    <li><strong>Ribosomes:</strong> Make proteins</li>
                    <li><strong>Endoplasmic reticulum:</strong>
                      <ul className="list-disc list-inside ml-6 leading-relaxed">
                        <li><strong>Rough ER:</strong> Makes and modifies proteins</li>
                        <li><strong>Smooth ER:</strong> Makes lipids</li>
                      </ul>
                    </li>
                    <li><strong>Golgi apparatus:</strong> Sorts, packages, and processes proteins</li>
                    <li><strong>Vesicles and vacuoles:</strong> Storage and transport sacs</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Similarities Section */}
      <motion.section
        className="mt-6 md:mt-8 mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <SectionHeader title="Similarities Between Prokaryotic and Eukaryotic Cells" showInfo={showSimilarities} setShowInfo={setShowSimilarities} />
        <AnimatePresence>
          {showSimilarities && (
            <motion.div
              className="p-4 bg-gray-50 rounded-md shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="leading-relaxed">
                Both prokaryotic and eukaryotic cells share fundamental features:
              </p>
              <ul className="list-disc list-inside ml-4 leading-relaxed">
                <li>They are enclosed by a cell membrane that controls what enters and exits the cell.</li>
                <li>Both contain cytoplasm, where cellular activities occur.</li>
                <li>Both have ribosomes to synthesize proteins.</li>
                <li>Both use DNA as the genetic material.</li>
                <li>Both contain vesicles and vacuoles for storage and transport.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Differences Section */}
      <motion.section
        className="mt-6 md:mt-8 mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <SectionHeader title="Differences Between Prokaryotic and Eukaryotic Cells" showInfo={showDifferences} setShowInfo={setShowDifferences} />
        <AnimatePresence>
          {showDifferences && (
            <motion.div
              className="p-4 bg-gray-50 rounded-md shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="leading-relaxed">
                The main difference is that prokaryotic cells lack a membrane-bound nucleus and organelles, while eukaryotic cells have them. Other differences include:
              </p>
              <ul className="list-disc list-inside ml-4 leading-relaxed">
                <li><strong>Size:</strong> Prokaryotes are smaller (1-10 µm) vs. Eukaryotes (10-100 µm).</li>
                <li><strong>Cellularity:</strong> Prokaryotes are unicellular; eukaryotes can be unicellular or multicellular.</li>
                <li><strong>Chromosomes:</strong> Prokaryotes have single circular chromosome; eukaryotes have multiple linear chromosomes.</li>
                <li><strong>Reproduction:</strong> Prokaryotes reproduce by binary fission; eukaryotes by mitosis or meiosis.</li>
                <li><strong>Organelles:</strong> Prokaryotes lack membrane-bound organelles; eukaryotes have them.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Video Section */}
      <motion.section
        className="mt-6 md:mt-8 mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <h2 className="text-3xl md:text-4xl text-blue-600 font-bold mb-4">Prokaryotic vs Eukaryotic Cells Overview Video</h2>
        <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
          {videoError ? (
            <p className="text-red-600 text-center p-4">Failed to load video. Please check your connection or try again later.</p>
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/RQ-SMCmWB1s?rel=0"
              title="Prokaryotic vs Eukaryotic Cells Overview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handleVideoError}
            />
          )}
        </div>
      </motion.section>

      {/* Buttons */}
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

export default Activity2;
