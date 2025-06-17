import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebaseConfig';
import { ArrowLeft } from 'lucide-react';

const Lesson = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const [completedLessons, setCompletedLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [score, setScore] = useState(0); // Add state for user's total score

  const lesson = {
    title: 'Lesson: Cells - The Basic Unit of Life',
    sections: [
      { heading: '1. Introduction to Genetics', lessonID: 'lesson1', path: '/lesson/lesson1' },
      { heading: '2. Cell Theory', lessonID: 'lesson2', path: '/lesson/lesson2' },
      { heading: '3. Cell Structure and Functions', lessonID: 'lesson3', path: '/lesson/lesson3' },
      { heading: '4. Prokaryotic vs Eukaryotic Cells', lessonID: 'lesson4', path: '/lesson/lesson4' },
      { heading: '5. Cell Types', lessonID: 'lesson5', path: '/lesson/lesson5' },
      { heading: '6. Cell Modifications', lessonID: 'lesson6', path: '/lesson/lesson6' },
    ],
  };

  useEffect(() => {
    if (!username) {
      setErrorMessage('No user logged in. Please log in to access lessons.');
      setLoading(false);
      return;
    }

    const userLessonsRef = ref(database, `users/${username}/completedLessons`);

    const unsubscribe = onValue(
      userLessonsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setCompletedLessons(data);

          // Calculate total score by summing 'score' fields in completed lessons if applicable
          let totalScore = 0;
          lesson.sections.forEach(({ lessonID }) => {
            if (data[lessonID]?.score) {
              totalScore += data[lessonID].score;
            }
          });
          setScore(totalScore);
        } else {
          setCompletedLessons({});
          setScore(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching completed lessons:', error);
        setErrorMessage('Failed to load lesson progress. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading lessons...
      </div>
    );
  }

  return (
    <main className="p-6 md:p-12 lg:p-24 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </button>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">
        {lesson.title}
      </h1>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">
          {errorMessage}
        </div>
      )}

      <div className="space-y-6">
        {lesson.sections.map((section, index) => {
          const lessonID = section.lessonID;
          const lessonData = completedLessons[lessonID] || {};
          const lessonCompleted = lessonData.completed;
          const lessonUnlocked =
            index === 0 || completedLessons[lesson.sections[index - 1]?.lessonID]?.completed || lessonData.unlocked;

          return (
            <div
              key={lessonID}
              className="p-6 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {section.heading}
              </h2>

              {lessonUnlocked ? (
                <div className="flex items-center justify-between">
                  <Link
                    to={section.path}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {lessonCompleted ? '✅ View Lesson Again' : '📘 Start Lesson'}
                  </Link>
                  {lessonCompleted && (
                    <div className="flex flex-col items-end text-green-600 font-semibold text-right">
                      {lessonData.score !== undefined && (
                        <span>{lessonData.score}/10</span>
                      )}
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  🔒 Complete the previous lesson to unlock.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Display total score */}
      <div className="mt-8 p-4 bg-blue-100 text-blue-800 rounded-lg text-center font-semibold">
        Total Score: {score}/60
      </div>
    </main>
  );
};

export default Lesson;
