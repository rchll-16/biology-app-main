import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import DNA from '../../assets/images/dna.png';
import Genes from '../../assets/images/genes.png';

function Introduction() {
  const navigate = useNavigate();
  const resolvedUsername = localStorage.getItem('username');

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [showDNAInfo, setShowDNAInfo] = useState(false);
  const [showGenesInfo, setShowGenesInfo] = useState(false);
  const [showChromosomesInfo, setShowChromosomesInfo] = useState(false);
  const [showInheritanceInfo, setShowInheritanceInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resolvedUsername) {
      alert('⚠️ You must be logged in to access this lesson.');
      navigate('/');
      return;
    }

    const checkCompletion = async () => {
      setLoading(true);
      try {
        const lessonRef = ref(database, `users/${resolvedUsername}/completedLessons/lesson1`);
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
        [`users/${resolvedUsername}/completedLessons/lesson1`]: { completed: true },
        [`users/${resolvedUsername}/completedLessons/lesson2`]: { unlocked: true },
      };

      await update(ref(database), updates);
      setAlreadyCompleted(true);
      alert('✅ Lesson 1 marked as complete! Lesson 2 is now unlocked.');
      navigate('/lesson', { state: { quizCompleted: true, finalScore: 5, totalPossibleScore: 5, lessonID: 'lesson1' } });
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
      alert('❌ Error saving progress. Please try again.');
    }
  };

  const handleGoToLesson = () => {
    navigate('/lesson');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <motion.main
      className="w-full max-w-full px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 space-y-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SectionIntro />
      <SectionDNA show={showDNAInfo} setShow={setShowDNAInfo} />
      <SectionGenes show={showGenesInfo} setShow={setShowGenesInfo} />
      <SectionChromosomes show={showChromosomesInfo} setShow={setShowChromosomesInfo} />
      <SectionInheritance show={showInheritanceInfo} setShow={setShowInheritanceInfo} />

      <div className="flex justify-center gap-4 mt-12 flex-wrap">
        <button
          onClick={handleComplete}
          disabled={alreadyCompleted}
          className={`${
            alreadyCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-8 py-3 rounded-lg text-lg transition shadow-md`}
        >
          {alreadyCompleted ? '✅ Completed' : 'Complete Lesson & Unlock Next'}
        </button>
        <button
          onClick={handleGoToLesson}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg transition shadow-md"
        >
          Go to Lesson
        </button>
      </div>
    </motion.main>
  );
}

const FunFact = ({ fact }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="my-4 text-center w-full max-w-screen-xl mx-auto">
      <button
        onClick={() => setShow(!show)}
        className="bg-yellow-100 border border-yellow-400 px-6 py-3 rounded hover:bg-yellow-200 font-semibold transition flex items-center justify-center mx-auto"
        aria-expanded={show}
        aria-controls="funfact-content"
      >
        {show ? (
          <>
            Hide Fact
            <FontAwesomeIcon icon={faChevronUp} className="ml-2" />
          </>
        ) : (
          <>
            💡 Did You Know?
            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </>
        )}
      </button>
      <AnimatePresence>
        {show && (
          <motion.p
            id="funfact-content"
            className="mt-4 text-gray-700 text-lg px-6 py-4 bg-yellow-50 border border-yellow-200 rounded w-full max-w-screen-xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {fact}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionHeader = ({ title, showInfo, setShowInfo }) => (
  <h1
    role="button"
    tabIndex={0}
    onClick={() => setShowInfo(!showInfo)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setShowInfo(!showInfo);
      }
    }}
    className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 cursor-pointer flex items-center justify-center select-none w-full max-w-screen-xl mx-auto"
    aria-expanded={showInfo}
    aria-controls={`${title.replace(/\s+/g, '-').toLowerCase()}-content`}
  >
    {title}
    <span className="text-sm ml-4 flex items-center">
      (Click to {showInfo ? 'Hide' : 'Learn More'})
      <FontAwesomeIcon icon={showInfo ? faChevronUp : faChevronDown} className="ml-2" />
    </span>
  </h1>
);

const SectionIntro = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full max-w-screen-xl mx-auto"
  >
    <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 mb-8">
      Introduction to Genetics
    </h1>
    <div className="bg-blue-50 p-8 rounded-lg shadow-md">
      <p className="text-lg sm:text-xl md:text-2xl mb-6 text-justify">
        Genetics is a branch of biology focused on understanding how traits are passed from parents to their offspring—a process known as heredity. At the heart of genetics is a molecule called DNA (deoxyribonucleic acid), which carries the complete set of instructions needed for an organism to grow, function, and reproduce. These instructions are organized into specific segments called genes, each responsible for directing cells to perform particular tasks. Together, these genes determine the physical and behavioral characteristics, or traits, of an organism.
      </p>
      <p className="text-lg sm:text-xl md:text-2xl text-justify">
        Heredity explains why children often resemble their parents. During reproduction, DNA is copied and transmitted from the parents to their offspring. This inherited genetic material plays a major role in shaping how an individual looks and behaves. However, genes do not act alone—environmental factors such as climate, nutrition, and lifestyle can influence how genes are expressed, ultimately affecting the development and appearance of the organism. This interplay between heredity and environment makes each individual unique.
      </p>
    </div>
    <FunFact fact="The word 'gene' comes from the Greek word 'genos,' meaning generation or birth." />
  </motion.section>
);

const SectionDNA = ({ show, setShow }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="w-full max-w-screen-xl mx-auto"
  >
    <SectionHeader title="DNA" showInfo={show} setShowInfo={setShow} />
    <AnimatePresence>
      {show && (
        <motion.div
          id="dna-content"
          className="flex flex-col lg:flex-row items-center gap-12 mt-10 bg-gray-50 p-8 rounded-lg shadow-md max-w-screen-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <img className="w-full lg:w-1/3 max-w-md rounded-lg shadow-md" src={DNA} alt="DNA Molecule" />
          <div className="text-lg sm:text-xl md:text-2xl text-justify max-w-3xl">
            <p>
              DNA, or deoxyribonucleic acid, is the foundation of genetics and the ideal starting point for understanding how heredity works. It is the molecule that carries the genetic instructions for the development, functioning, and reproduction of all living organisms. DNA is composed of specific sequences that code for genes, which are responsible for building proteins—the essential components used by cells to perform various tasks. These proteins ultimately determine the traits that are expressed in an organism, such as eye color or blood type.
            </p>
            <p className="mt-4">
              Structurally, DNA exists as a long, double-stranded molecule known as a double helix, tightly coiled and stored within the nucleus of eukaryotic cells. It is one of the four fundamental molecules of life, classified as a nucleic acid. During cell division, DNA replicates so that each new cell receives an exact copy of the genetic information. In sexual reproduction, offspring inherit half of their DNA from each parent—50% from the mother and 50% from the father—resulting in a unique combination of genetic material that contributes to genetic diversity.
            </p>
            <FunFact fact="If uncoiled, the DNA in one human cell would stretch about 2 meters long!" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

const SectionGenes = ({ show, setShow }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
    className="w-full max-w-screen-xl mx-auto"
  >
    <SectionHeader title="Genes" showInfo={show} setShowInfo={setShow} />
    <AnimatePresence>
      {show && (
        <motion.div
          id="genes-content"
          className="flex flex-col lg:flex-row items-center gap-12 mt-10 bg-gray-50 p-8 rounded-lg shadow-md max-w-screen-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <img className="w-full lg:w-1/3 max-w-md rounded-lg shadow-md" src={Genes} alt="Genes Illustration" />
          <div className="text-lg sm:text-xl md:text-2xl text-justify max-w-3xl">
            <p>
              A gene is a specific segment of a DNA molecule that contains the instructions for making a particular protein. Each gene has a unique sequence of DNA that serves as a code for its corresponding protein. In complex organisms, there can be over 100,000 different genes, meaning each one carries a unique set of instructions that help the organism grow, function, and develop. Genes are the fundamental units of heredity, passed from parents to offspring. In simple organisms like bacteria, genes are inherited through asexual reproduction, meaning the offspring are genetically identical to the single parent.
            </p>
            <p className="mt-4">
              In humans and other sexually reproducing organisms, individuals inherit two copies of each gene—one from the mother and one from the father. These gene variants are called alleles, and a person may inherit two identical alleles or two different ones for any given gene. The combination of these alleles influences an individual's traits, such as eye color, height, or blood type. Often, physical traits are not controlled by a single gene but by the interaction of multiple genes. Additionally, environmental factors such as diet, climate, and lifestyle can affect how these genes are expressed, leading to variations in how traits appear among individuals.
            </p>
            <FunFact fact="Humans have about 20,000 to 25,000 genes in their DNA." />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

const SectionChromosomes = ({ show, setShow }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.8 }}
    className="w-full max-w-screen-lg mx-auto"
  >
    <SectionHeader title="Chromosomes" showInfo={show} setShowInfo={setShow} />
    <AnimatePresence>
      {show && (
        <motion.div
          id="chromosomes-content"
          className="mt-6 bg-gray-50 p-8 rounded-lg shadow-md text-lg sm:text-xl md:text-2xl text-justify max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p>
            A chromosome is a structure composed of tightly coiled strands of DNA wrapped around proteins called histones, forming long, worm-like shapes known as chromatids. Two chromatids join to form a complete chromosome, which becomes visible under a light microscope during certain stages of cell division. Chromosomes are found in the nucleus of eukaryotic cells and play a crucial role in ensuring that genetic information is accurately copied and distributed. The number of chromosomes varies by species—humans have 46 chromosomes, while some organisms may have over 100 or as few as two, reflecting the diversity of life.
          </p>
          <FunFact fact="Humans have 23 pairs of chromosomes—22 pairs of autosomes and one pair of sex chromosomes." />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

const SectionInheritance = ({ show, setShow }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1.0 }}
    className="w-full max-w-screen-lg mx-auto"
  >
    <SectionHeader title="Genetic Inheritance" showInfo={show} setShowInfo={setShow} />
    <AnimatePresence>
      {show && (
        <motion.div
          id="inheritance-content"
          className="mt-6 bg-gray-50 p-8 rounded-lg shadow-md text-lg sm:text-xl md:text-2xl text-justify max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p>
            Inheritance is a fundamental concept in genetics, referring to the way traits are passed from one generation to the next. Even before the discovery of DNA or the term "genetics," people observed how physical traits were inherited within families. In sexual reproduction, two parents contribute DNA to create a genetically unique offspring, while in asexual reproduction, a single parent produces a genetic clone of itself. Regardless of the method, genetic information is transferred from parent to offspring. The groundwork for modern genetics was laid by Gregor Mendel, a monk whose experiments with pea plants revealed predictable patterns of inheritance, forming the basis of what we now understand about how traits are passed down.
          </p>
          <FunFact fact="Gregor Mendel is known as the Father of Genetics for his experiments with pea plants." />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

export default Introduction;
