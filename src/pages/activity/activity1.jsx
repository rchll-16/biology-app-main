import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import Confetti from 'react-confetti';

const multipleChoiceQuestions = [
  {
    question: 'Who first coined the term “cell” after observing cork under a microscope?',
    options: ['Anton van Leeuwenhoek', 'Matthias Schleiden', 'Robert Hooke', 'Theodor Schwann'],
    correctAnswer: 2,
    explanation: 'Robert Hooke first coined the term "cell" after observing cork under a microscope.'
  },
  {
    question: 'Which scientist discovered the nucleus in plant cells?',
    options: ['Robert Brown', 'Rudolf Virchow', 'Robert Hooke', 'Anton van Leeuwenhoek'],
    correctAnswer: 0,
    explanation: 'Robert Brown discovered the nucleus in plant cells.'
  },
  {
    question: 'What does Rudolf Virchow\'s famous statement “Omnis cellula e cellula” mean?',
    options: ['Cells are invisible', 'Cells come from other cells', 'All organisms are animals', 'Cells are made of cork'],
    correctAnswer: 1,
    explanation: 'Rudolf Virchow\'s statement means "Cells come from other cells."'
  },
  {
    question: 'Which of the following is a unicellular organism?',
    options: ['Dog', 'Paramecium', 'Mushroom', 'Tree'],
    correctAnswer: 1,
    explanation: 'Paramecium is a unicellular organism.'
  },
];

const trueFalseQuestions = [
  {
    question: 'All living organisms are made up of multiple cells.',
    correctAnswer: false,
    explanation: 'Some organisms, like bacteria and yeast, are unicellular.'
  },
  {
    question: 'Anton van Leeuwenhoek was the first to observe living cells.',
    correctAnswer: true,
    explanation: 'Anton van Leeuwenhoek was indeed the first to observe living cells.'
  },
  {
    question: 'Cell theory states that cells can appear spontaneously from non-living material.',
    correctAnswer: false,
    explanation: 'Cell theory states that all cells come from pre-existing cells.'
  },
];

const identificationQuestions = [
  {
    question: 'He extended the idea of cell theory to animals.',
    correctAnswer: 'Theodor Schwann',
    explanation: 'Theodor Schwann extended the cell theory to animals.'
  },
  {
    question: 'An organism made up of only one cell.',
    correctAnswer: 'Unicellular organism',
    explanation: 'A unicellular organism is made up of only one cell.'
  },
  {
    question: 'The scientist who proposed that all cells come from pre-existing cells.',
    correctAnswer: 'Rudolf Virchow',
    explanation: 'Rudolf Virchow proposed that all cells come from pre-existing cells.'
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
    <svg width="80" height="80" className="mx-auto my-4" role="progressbar" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={progress * duration}>
      <circle cx="40" cy="40" r={radius} stroke="#e5e7eb" strokeWidth="5" fill="none" />
      <circle
        cx="40"
        cy="40"
        r={radius}
        stroke="#3b82f6"
        strokeWidth="5"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
      />
    </svg>
  );
};

const InstructionScreen = ({ text, duration, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <motion.div
      className="text-center p-10 text-xl font-medium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
      if (selected === null && question.type !== 'id') onAnswer(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [selected, question.type, onAnswer, answered]);

  const handleSubmit = () => {
    if (answered) return;
    const trimmed = input.trim().toLowerCase();
    const correct = question.correctAnswer.toString().toLowerCase();
    onAnswer(trimmed === correct ? input : input);
    setAnswered(true);
  };

  const handleOptionClick = (i) => {
    if (answered) return;
    setSelected(i);
    setTimeout(() => onAnswer(i), 1000);
    setAnswered(true);
  };

  return (
    <motion.div className="p-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <CircleTimer duration={5000} />
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      {question.type === 'mc' && (
        <div className="grid gap-2">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              className={`px-4 py-2 rounded text-white transition ${selected === i ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {question.type === 'tf' && (
        <div className="grid gap-2">
          {['True', 'False'].map((val, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(val.toLowerCase() === 'true')}
              className={`px-4 py-2 rounded text-white transition ${
                selected === (val.toLowerCase() === 'true') ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={answered}
            >
              {val}
            </button>
          ))}
        </div>
      )}
      {question.type === 'id' && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            className="border px-4 py-2 w-full max-w-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={answered}
          />
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={answered}>
            Submit
          </button>
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
      {isCorrect ? (
        <div>
          <p>✅ Correct!</p>
          <p className="mt-2 text-gray-700">{explanation}</p>
        </div>
      ) : (
        <div>
          <p>❌ Incorrect</p>
          <p className="mt-2 text-gray-700">The correct answer is: {explanation}</p>
        </div>
      )}
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
      const resultsRef = ref(database, `users/${username}/quizResults/activity1`);
      await set(resultsRef, {
        score: score,
        total: total,
        timestamp: new Date().toISOString()
      });
      console.log(`Quiz results for activity1 saved to Firebase!`);
    } catch (error) {
      console.error(`Error saving quiz results for activity1:`, error);
      alert('Failed to save quiz results. Please try again.');
    }
  };

  const saveLeaderboardData = async (username, score, activityID) => {
    try {
      const leaderboardRef = ref(database, `leaderboard/${username}/${activityID}`);
      await set(leaderboardRef, {
        username,
        score,
        activityID,
        timestamp: new Date().toISOString()
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
    if (percentage === 100) return 'Excellent! You have mastered the topic!';
    if (percentage >= 80) return 'Great job! You\'re doing really well!';
    if (percentage >= 50) return 'Good effort! Keep practicing to improve!';
    if (percentage > 0) return 'Don\'t give up! Keep learning and try again!';
    return 'Let\'s get started! You can do it!';
  };

  const handleBackToLesson = async () => {
    if (!username) {
      alert('You must be logged in to save your progress.');
      return;
    }

    try {
      await saveQuizResults(username, score, total);
      await saveLeaderboardData(username, score, 'activity1');

      const lessonRef = ref(database, `users/${username}/completedLessons/lesson2`);
      await set(lessonRef, {
        score: score,
        total: total,
        completed: true,
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
      console.error('Error saving progress:', error);
      alert('Failed to save progress. Please try again.');
    }
  };

  return (
    <motion.div className="text-center p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Confetti width={width} height={height} />
      <h2 className="text-2xl font-bold text-blue-700">Quiz Completed!</h2>
      <p className="text-lg mt-2">You scored {score} out of {total}</p>
      <p className="mt-2 text-yellow-700 font-semibold">{getMotivationMessage()}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleBackToLesson}
      >
        Back to Lesson
      </button>
    </motion.div>
  );
};

const Activity1 = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = allQuestions[step - 2];
  const totalPossibleScore = allQuestions.length;

  const handleAnswer = (response) => {
    if (answered) return;

    let isCorrect = false;
    if (currentQuestion.type === 'mc') {
      isCorrect = response === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'tf') {
      isCorrect = response === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'id') {
      isCorrect = response?.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    }

    if (isCorrect) setScore(prev => prev + 1);

    const answerObj = {
      selected: response,
      correct: isCorrect,
      explanation: currentQuestion.explanation
    };
    setAnswers(prev => [...prev, answerObj]);
    setReveal(true);
    setAnswered(true);
  };

  const nextStep = () => {
    if (reveal) {
      setReveal(false);
      setStep(prev => prev + 1);
      setAnswered(false);
    }
  };

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 3000);
      return () => clearTimeout(timer);
    } else if (step === 1) {
      const timer = setTimeout(() => setStep(2), 5000);
      return () => clearTimeout(timer);
    } else if (step > 1 && step - 2 >= allQuestions.length) {
      setStep(allQuestions.length + 2);
    }
  }, [step]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 border rounded shadow bg-white">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <InstructionScreen
              key="greeting"
              text="👋 Welcome to the Cell Theory Quiz!"
              duration={3000}
              onDone={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <InstructionScreen
              key="instruction"
              text="📘 You will be given multiple types of questions. You have 5 seconds to answer each."
              duration={5000}
              onDone={() => setStep(2)}
            />
          )}
          {step > 1 && step - 2 < allQuestions.length && !reveal && (
            <QuestionScreen key={`q-${step}`} question={currentQuestion} onAnswer={handleAnswer} />
          )}
          {reveal && (
            <AnswerReveal
              key={`a-${step}`}
              isCorrect={answers[step - 2]?.correct}
              explanation={answers[step - 2]?.explanation}
              onContinue={nextStep}
            />
          )}
          {step === allQuestions.length + 2 && (
            <QuizResults key="results" score={score} total={totalPossibleScore} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Activity1;
