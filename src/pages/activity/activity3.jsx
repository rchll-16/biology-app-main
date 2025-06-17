import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { database } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import Confetti from 'react-confetti';

const multipleChoiceQuestions = [
  {
    question: 'What is the main structural difference between prokaryotic and eukaryotic cells?',
    options: ['Presence of ribosomes', 'Type of DNA', 'Presence of a membrane-bound nucleus', 'Ability to reproduce'],
    correctAnswer: 2, // C. Presence of a membrane-bound nucleus
    explanation: 'Eukaryotic cells have a membrane-bound nucleus, while prokaryotic cells do not.'
  },
  {
    question: 'Which of the following is found in both prokaryotic and eukaryotic cells?',
    options: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Chloroplasts'],
    correctAnswer: 2, // C. Ribosomes
    explanation: 'Ribosomes are essential for protein synthesis and are found in all cells.'
  },
  {
    question: 'Which cell type generally has a single, circular chromosome?',
    options: ['Plant cell', 'Animal cell', 'Fungal cell', 'Prokaryotic cell'],
    correctAnswer: 3, // D. Prokaryotic cell
    explanation: 'Prokaryotic cells typically have a single, circular chromosome located in the nucleoid region.'
  },
  {
    question: 'What structure helps prokaryotic cells attach to surfaces and transfer DNA?',
    options: ['Flagella', 'Pili', 'Ribosomes', 'Plasmids'],
    correctAnswer: 1, // B. Pili
    explanation: 'Pili are used for attachment and the transfer of DNA between prokaryotic cells.'
  },
];

const trueFalseQuestions = [
  {
    question: 'Eukaryotic cells can be either unicellular or multicellular.',
    correctAnswer: true,
    explanation: 'Eukaryotic cells can exist as single-celled organisms (e.g., yeast) or as part of multicellular organisms (e.g., animals, plants).'
  },
  {
    question: 'Prokaryotic cells do not have cytoplasm.',
    correctAnswer: false,
    explanation: 'Prokaryotic cells have cytoplasm, which contains the cell\'s internal components.'
  },
  {
    question: 'Flagella in prokaryotes and eukaryotes have the same structure.',
    correctAnswer: false,
    explanation: 'Prokaryotic and eukaryotic flagella differ significantly in structure and mechanism of movement.'
  },
];

const identificationQuestions = [
  {
    question: 'The region in a prokaryotic cell where DNA is located.',
    correctAnswer: 'Nucleoid',
    explanation: 'The nucleoid is the irregularly shaped region within a prokaryotic cell where the genetic material is localized.'
  },
  {
    question: 'Double-membraned organelle in eukaryotes that produces ATP.',
    correctAnswer: 'Mitochondria',
    explanation: 'Mitochondria are responsible for generating energy (ATP) through cellular respiration in eukaryotic cells.'
  },
  {
    question: 'Small, independently replicating DNA molecules in prokaryotes.',
    correctAnswer: 'Plasmids',
    explanation: 'Plasmids are small, circular DNA molecules that are separate from the bacterial chromosome and can replicate independently.'
  },
];

const allQuestions = [
  ...multipleChoiceQuestions.map(q => ({ ...q, type: 'mc' })),
  ...trueFalseQuestions.map(q => ({ ...q, type: 'tf' })),
  ...identificationQuestions.map(q => ({ ...q, type: 'id' }))
];

const CircleTimer = ({ duration }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / duration, 1));
    }, 100);
    return () => clearInterval(timer);
  }, [duration]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width="80" height="80" className="mx-auto my-4">
      <circle cx="40" cy="40" r={radius} stroke="#e5e7eb" strokeWidth="5" fill="none" />
      <circle cx="40" cy="40" r={radius} stroke="#3b82f6" strokeWidth="5" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
    </svg>
  );
};

const InstructionScreen = ({ text, duration, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <motion.div className="text-center p-10 text-xl font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {text}
    </motion.div>
  );
};

const QuestionScreen = ({ question, onAnswer }) => {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (answered) return;

    const timer = setTimeout(() => {
      if (selected === null && question.type !== 'id') {
        onAnswer(null);
        setAnswered(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [selected, question.type, onAnswer, answered]);

  const handleSubmit = () => {
    if (answered) return;

    const trimmed = input.trim().toLowerCase();
    const correct = question.correctAnswer.toLowerCase(); // Ensure comparison is correct
    onAnswer(trimmed === correct ? input : input);
    setAnswered(true);
  };

  const handleOptionClick = (i) => {
    if (answered) return;

    setSelected(i);
    setAnswered(true);
    setTimeout(() => onAnswer(i), 1000);
  };

  return (
    <motion.div className="p-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <CircleTimer duration={5000} />
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      {question.type === 'mc' && (
        <div className="grid gap-2">
          {question.options.map((option, i) => (
            <button key={i} onClick={() => handleOptionClick(i)} className={`px-4 py-2 rounded text-white transition ${selected === i ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`} disabled={answered}>{option}</button>
          ))}
        </div>
      )}
      {question.type === 'tf' && (
        <div className="grid gap-2">
          {['True', 'False'].map((val, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(val === 'True')}
              className={`px-4 py-2 rounded text-white transition ${selected === (val === 'True') ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={answered}
            >
              {val}
            </button>
          ))}
        </div>
      )}
      {question.type === 'id' && (
        <div className="flex flex-col items-center gap-4">
          <input type="text" className="border px-4 py-2 w-full max-w-sm" value={input} onChange={(e) => setInput(e.target.value)} disabled={answered}/>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={answered}>Submit</button>
        </div>
      )}
    </motion.div>
  );
};

const AnswerReveal = ({ isCorrect, explanation, onContinue }) => {
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <motion.div
      className={`p-6 text-center font-medium text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
      <p className="mt-2 text-gray-700">{explanation}</p>
    </motion.div>
  );
};

const QuizResults = ({ score, total }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveQuizResults = async (username, score, total) => {
    try {
      const resultsRef = ref(database, `users/${username}/quizResults/activity3`); // Changed to activity3
      await set(resultsRef, {
        score: score,
        total: total,
        timestamp: new Date().toISOString() // Optional: Add timestamp
      });
      console.log(`Quiz results for activity3 saved to Firebase!`);
    } catch (error) {
      console.error(`Error saving quiz results for activity3:`, error);
      alert("Failed to save quiz results. Please try again.");
    }
  };

  // Function to save leaderboard data
  const saveLeaderboardData = async (username, score, activityID) => {
    try {
      const leaderboardRef = ref(database, `leaderboard/${username}/${activityID}`);
      await set(leaderboardRef, {
        username,
        score,
        activityID,
        timestamp: new Date().toISOString() // Optional: Add timestamp
      });
      console.log(`Leaderboard data for user ${username} saved successfully for ${activityID}.`);
    } catch (error) {
      console.error('Error saving leaderboard data:', error);
      alert('Failed to save leaderboard data. Please try again.');
    }
  };

  // Add motivational feedback based on score percentage
  const getMotivationMessage = () => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return '🎉 Perfect score! Outstanding work!';
    if (percentage >= 80) return '👏 Great job! You\'re doing very well!';
    if (percentage >= 50) return '👍 Good effort! Keep practicing for better results.';
    if (percentage > 0) return '💪 Keep trying! Every step counts.';
    return '📚 Let\'s get started! You can do it!';
  };

  const handleBackToLesson = async () => {
    if (!username) {
      alert("You must be logged in to save your progress.");
      return;
    }

    try {
      // Save leaderboard data
      await saveLeaderboardData(username, score, 'activity3'); // Save leaderboard data

      // Save quiz results
      await saveQuizResults(username, score, total);

      // Mark lesson as completed and unlock next lesson
      const lessonRef = ref(database, `users/${username}/completedLessons/lesson4`); // Changed to lesson4
      await set(lessonRef, {
        score: score,
        total: total,
        completed: true,
        unlocked: true
      });

      // Unlock next lesson
      const nextLessonRef = ref(database, `users/${username}/completedLessons/lesson5`); // Changed to lesson5
      await set(nextLessonRef, {
        unlocked: true
      });

      navigate('/lesson', {
        state: {
          quizCompleted: true,
          finalScore: score,
          totalPossibleScore: total,
        },
      });
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Failed to save progress. Please try again.");
    }
  };

  return (
    <motion.div className="text-center p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Confetti width={width} height={height} />
      <h2 className="text-2xl font-bold text-blue-700">Quiz Completed!</h2>
      <p className="text-lg mt-2">You scored {score} out of {total}</p>
      <p className="mt-4 text-yellow-700 font-semibold text-lg">{getMotivationMessage()}</p>
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400"
        onClick={handleBackToLesson}
      >
        Back to Lesson
      </button>
    </motion.div>
  );
};

const Activity3 = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const currentQuestion = allQuestions[step - 2];
  const totalPossibleScore = allQuestions.length;

  const handleAnswer = useCallback((response) => {
    if (answered) return;

    let isCorrect = false;
    if (currentQuestion.type === 'mc') {
      isCorrect = response === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'tf') {
      isCorrect = response === currentQuestion.correctAnswer; // Ensure response is compared correctly
    } else if (currentQuestion.type === 'id') {
      isCorrect = response?.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const answerObj = {
      selected: response,
      correct: isCorrect,
      explanation: currentQuestion.explanation,
    };

    setAnswers((prev) => [...prev, answerObj]);
    setReveal(true);
    setAnswered(true);
  }, [answered, currentQuestion]);

  const nextStep = useCallback(() => {
    if (reveal) {
      setReveal(false);
      setStep((prev) => prev + 1);
      setAnswered(false);
    }
  }, [reveal]);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 3000);
      return () => clearTimeout(timer);
    } else if (step === 1) {
      const timer = setTimeout(() => setStep(2), 5000);
      return () => clearTimeout(timer);
    } else {
      if (step > 1 && step - 2 >= allQuestions.length) {
        setStep(allQuestions.length + 2);
      }
    }
  }, [step]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 border rounded shadow bg-white">
        <AnimatePresence mode="wait">
          {step === 0 && <InstructionScreen key="greeting" text="👋 Welcome to the Prokaryotic vs Eukaryotic Cells Quiz!" duration={3000} onDone={() => setStep(1)} />}
          {step === 1 && <InstructionScreen key="instruction" text="📘 You will be given multiple types of questions. You have 5 seconds to answer each." duration={5000} onDone={() => setStep(2)} />}
          {step > 1 && step - 2 < allQuestions.length && !reveal && <QuestionScreen key={`q-${step}`} question={currentQuestion} onAnswer={handleAnswer} />}
          {reveal && <AnswerReveal key={`a-${step}`} isCorrect={answers[step - 2]?.correct} explanation={answers[step - 2]?.explanation} onContinue={nextStep} />}
          {step === allQuestions.length + 2 && <QuizResults key="results" score={score} total={totalPossibleScore} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Activity3;
