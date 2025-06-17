import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { database } from '../../firebaseConfig';
import { ref, push } from 'firebase/database';

const Activity = () => {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState('greeting');
  const [timer, setTimer] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const quizList = {
    lesson: [
      { type: 'multiple', question: 'What is the basic unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Organ'], correct: 'Cell' },
      { type: 'multiple', question: 'Which organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correct: 'Mitochondria' },
      { type: 'multiple', question: 'Which structure controls cell activities?', options: ['Cell wall', 'Ribosome', 'Nucleus', 'Cytoplasm'], correct: 'Nucleus' },
      { type: 'multiple', question: 'Which is found only in plant cells?', options: ['Chloroplast', 'Ribosome', 'Lysosome', 'Mitochondria'], correct: 'Chloroplast' },
      { type: 'multiple', question: 'What surrounds and protects the cell?', options: ['Cell wall', 'Cytoplasm', 'Membrane', 'Nucleus'], correct: 'Membrane' },
      { type: 'truefalse', question: 'True or False: Animal cells have a cell wall.', correct: 'False' },
      { type: 'truefalse', question: 'True or False: Ribosomes produce proteins.', correct: 'True' },
      { type: 'truefalse', question: 'True or False: DNA is found in the cytoplasm.', correct: 'False' },
      { type: 'truefalse', question: 'True or False: Chloroplasts help with photosynthesis.', correct: 'True' },
      { type: 'truefalse', question: 'True or False: The cell membrane is selectively permeable.', correct: 'True' },
      { type: 'identification', question: 'Name the cell structure that contains genetic material.', correct: 'Nucleus' },
      { type: 'identification', question: 'What is the jelly-like substance inside the cell?', correct: 'Cytoplasm' },
      { type: 'identification', question: 'Which part acts as the cell’s boundary with its environment?', correct: 'Cell membrane' },
      { type: 'identification', question: 'Which organelle makes proteins?', correct: 'Ribosome' },
      { type: 'identification', question: 'Which part stores water in plant cells?', correct: 'Ribosome' },
    ],
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) setUsername(savedUsername);
    else alert('No username found. Please log in.');
  }, []);

  useEffect(() => {
    const phaseDurations = {
      greeting: 5,
      intro: 5,
      countdown: 3,
      question: 10,
      answer: 3,
      correct: 3
    };
    setTimer(phaseDurations[phase] || 0);
  }, [phase]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (timer === 0) nextPhase();
  }, [timer]);

  const nextPhase = () => {
    const currentQuestion = quizList[id][current];
    const userAnswer = selected?.toString().trim().toLowerCase();
    const correctAnswer = currentQuestion?.correct?.toString().trim().toLowerCase();

    switch (phase) {
      case 'greeting': return setPhase('intro');
      case 'intro': return setPhase('countdown');
      case 'countdown': return setPhase('question');
      case 'question': return setPhase('answer');
      case 'answer':
        setIsCorrect(userAnswer === correctAnswer);
        if (userAnswer === correctAnswer) setScore(prev => prev + 2);
        setUserAnswers(prev => [...prev, {
          question: currentQuestion.question,
          answer: selected,
          correct: currentQuestion.correct
        }]);
        return setPhase('correct');
      case 'correct':
        if (current + 1 < quizList[id].length) {
          setCurrent(prev => prev + 1);
          setSelected(null);
          setIsCorrect(null);
          return setPhase('countdown');
        } else {
          submitScore();
          setFinished(true);
          return setPhase('finished');
        }
      default: break;
    }
  };

  const submitScore = async () => {
    try {
      await push(ref(database, 'leaderboard'), {
        username,
        points: score,
        lessonId: id,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const currentQuestion = quizList[id][current];

  // Previous design: centered, simpler colors, no gradient background, cleaner buttons, etc.
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <div style={{ backgroundColor: 'white', padding: 30, borderRadius: 15, width: '100%', maxWidth: 700, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: 28, fontWeight: '700', color: '#2c3e50', marginBottom: 10 }}>
         Lesson - Quiz
        </h1>
        <p style={{ fontSize: 16, color: '#34495e', marginBottom: 5 }}>
          👤 {username}
        </p>
        <p style={{ fontSize: 16, color: '#34495e', marginBottom: 20 }}>
          🏆 Score: {score} / {quizList[id].length * 2}
        </p>

        {/* Timer bar */}
          <div style={{ backgroundColor: '#ddd', borderRadius: 10, overflow: 'hidden', height: 12, marginBottom: 20 }}>
            <div
              style={{
                height: '100%',
                width: `${
                  phase === 'question'
                    ? ((10 - timer) / 10) * 100
                    : ((3 - timer) / 3) * 100
                }%`,
                backgroundColor: phase === 'question' ? '#2980b9' : '#f39c12',
                transition: timer === (phase === 'question' ? 10 : 3) ? 'none' : 'width 1s linear',
              }}
            />
          </div>


        {/* Phase UI */}
        <div style={{ minHeight: 180, textAlign: 'center' }}>
          {phase === 'greeting' && (
            <p style={{ fontSize: 26, color: '#2980b9', animation: 'bounce 1.5s infinite' }}>👋 Welcome {username}!</p>
          )}
          {phase === 'intro' && (
            <p style={{ fontSize: 18, color: '#7f8c8d' }}>
              Get ready! Multiple question types await. Good luck!
            </p>
          )}
          {phase === 'countdown' && (
            <p style={{ fontSize: 22, fontWeight: '700', color: '#8e44ad' }}>
              Starting in... {timer}s
            </p>
          )}
          {phase === 'question' && (
            <>
              <p style={{ fontSize: 14, color: '#95a5a6' }}>
                Question {current + 1} of {quizList[id].length}
              </p>
              <p style={{ fontSize: 20, fontWeight: '700', color: '#2c3e50', marginBottom: 15 }}>
                {currentQuestion.question}
              </p>

              {currentQuestion.options ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '0 auto' }}>
                  {currentQuestion.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(option)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: '2px solid #2980b9',
                        backgroundColor: selected === option ? '#2980b9' : 'white',
                        color: selected === option ? 'white' : '#2980b9',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, color 0.3s',
                        userSelect: 'none',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={selected || ''}
                  onChange={e => setSelected(e.target.value)}
                  placeholder="Type your answer here"
                  style={{
                    width: '80%',
                    padding: 10,
                    borderRadius: 8,
                    border: '2px solid #2980b9',
                    fontSize: 16,
                    marginTop: 15,
                    outline: 'none',
                  }}
                />
              )}

              <p style={{ marginTop: 10, color: '#7f8c8d', fontSize: 14 }}>
                You have {timer}s to answer
              </p>

              <button
                onClick={nextPhase}
                disabled={!selected}
                style={{
                  marginTop: 20,
                  padding: '12px 28px',
                  borderRadius: 25,
                  border: 'none',
                  backgroundColor: selected ? '#2980b9' : '#bdc3c7',
                  color: 'white',
                  fontWeight: '700',
                  cursor: selected ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.3s',
                  userSelect: 'none',
                }}
              >
                Submit Answer
              </button>
            </>
          )}
          {phase === 'answer' && (
            <p style={{ fontSize: 20, color: '#f39c12', fontWeight: '700' }}>
              ⏳ Checking answer...
            </p>
          )}
          {phase === 'correct' && (
            <div>
              {isCorrect ? (
                <p style={{ fontSize: 22, fontWeight: '700', color: '#27ae60' }}>✅ Correct!</p>
              ) : (
                <p style={{ fontSize: 22, fontWeight: '700', color: '#c0392b' }}>
                  ❌ Incorrect. Correct answer: {currentQuestion.correct}
                </p>
              )}

              {currentQuestion.options && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '20px auto 0 auto' }}>
                  {currentQuestion.options.map((option, i) => {
                    const lowerOption = option.toLowerCase();
                    const lowerCorrect = currentQuestion.correct.toLowerCase();
                    const lowerSelected = selected?.toLowerCase();
                    let bgColor = 'white';
                    if (lowerOption === lowerCorrect) bgColor = '#27ae60aa';
                    else if (lowerOption === lowerSelected) bgColor = '#c0392baa';

                    return (
                      <div
                        key={i}
                        style={{
                          padding: '10px 15px',
                          borderRadius: 10,
                          border: '2px solid #2980b9',
                          backgroundColor: bgColor,
                          fontWeight: '600',
                          color: '#2c3e50',
                          userSelect: 'none',
                        }}
                      >
                        {option}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {phase === 'finished' && (
            <div>
              <p style={{ fontSize: 28, fontWeight: '700', color: '#27ae60' }}>
                🎉 Quiz Completed!
              </p>
              <p style={{ fontSize: 20, marginTop: 10 }}>
                Score: <strong>{score} / {quizList[id].length * 2}</strong>
              </p>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 15, flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.location.href = '/leaderboard'}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 25,
                    border: 'none',
                    backgroundColor: '#2980b9',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  View Leaderboard
                </button>

                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 25,
                    border: 'none',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {showAnswers ? 'Hide' : 'Show'} Your Answers
                </button>

                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 25,
                    border: 'none',
                    backgroundColor: '#8e44ad',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  🔄 Try Again
                </button>
              </div>

                {showAnswers && (
                <div
                  style={{
                    marginTop: 30,
                    backgroundColor: '#ecf0f1',
                    borderRadius: 15,
                    padding: 20,
                    maxHeight: 300,
                    overflowY: 'auto',
                    fontSize: 16,
                    color: '#34495e',
                  }}
                >
                  <h3 style={{ marginBottom: 15 }}>📝 Your Answers:</h3>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {userAnswers.map((ans, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: 12,
                          padding: 10,
                          borderRadius: 10,
                          backgroundColor:
                            ans.answer?.toString().trim().toLowerCase() ===
                            ans.correct?.toString().trim().toLowerCase()
                              ? '#dff0d8'
                              : '#f2dede',
                          border: '1px solid #ccc',
                        }}
                      >
                        <strong>Q{index + 1}:</strong> {ans.question}
                        <br />
                        <strong>Your Answer:</strong> {ans.answer}
                        <br />
                        <strong>Correct Answer:</strong> {ans.correct}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
