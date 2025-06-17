import { useEffect, useState, useCallback } from 'react';
import { Trophy, User, ArrowLeft, RefreshCw } from 'lucide-react';
import { database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [users, setUsers] = useState([]); // { username, totalScore }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);

  const navigate = useNavigate();
  const currentUsername = (localStorage.getItem('username') || '').toLowerCase();

  const fetchLeaderboardData = useCallback(() => {
    setLoading(true);
    setError(null);

    const leaderboardRef = ref(database, `leaderboard`);
    const usersRef = ref(database, 'users');

    const unsubscribeUsers = onValue(
      usersRef,
      (snapshotUsers) => {
        const usersData = snapshotUsers.val() || {};

        const unsubscribeLeaderboard = onValue(
          leaderboardRef,
          (snapshotLeaderboard) => {
            const leaderboardData = snapshotLeaderboard.val() || {};

            // Create leaderboard list based on all activities
            const leaderboardList = Object.entries(leaderboardData).flatMap(([userId, activities]) => {
              const totalScore = Object.values(activities).reduce((sum, activity) => {
                return sum + (activity.score || 0); // Sum scores for all activities
              }, 0);

              const username = (usersData[userId] && usersData[userId].username) || userId;
              return {
                username,
                totalScore,
              };
            });

            // Filter and sort users
            const filteredUsers = leaderboardList.filter(u => u.totalScore > 0);
            filteredUsers.sort((a, b) => b.totalScore - a.totalScore);

            setUsers(filteredUsers);

            // Calculate user rank based on the sorted list
            const rankIndex = filteredUsers.findIndex(
              u => (u.username || '').toLowerCase() === currentUsername
            );
            setUserRank(rankIndex !== -1 ? rankIndex + 1 : null); // Rank is 1-based

            setLoading(false);
            unsubscribeLeaderboard();
          },
          (error) => {
            console.error('Failed to read leaderboard:', error);
            setError('Unable to load leaderboard. Please try again later.');
            setLoading(false);
          },
          { onlyOnce: true }
        );

        unsubscribeUsers();
      },
      (error) => {
        console.error('Failed to read users:', error);
        setError('Unable to load users. Please try again later.');
        setLoading(false);
      },
      { onlyOnce: true }
    );
  }, [currentUsername]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getFeedbackByRank = (rank) => {
    if (rank === 1) return "🔥 You're the champion!";
    if (rank === 2) return "💪 Almost there!";
    if (rank === 3) return "👏 Great effort!";
    if (rank <= 5) return "🌟 Top performer!";
    if (rank <= 10) return "👍 Keep it up!";
    return "📈 Keep practicing!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-gray-600 text-xl">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-green-600 hover:text-green-800 transition"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Refresh button */}
        <button
          onClick={fetchLeaderboardData}
          className="absolute top-6 right-6 text-blue-600 hover:text-blue-800 transition flex items-center gap-1 px-3 py-1 rounded bg-blue-100"
          title="Refresh leaderboard"
          aria-label="Refresh leaderboard"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>

        <div className="flex flex-col items-center justify-center gap-2 mb-6 text-yellow-500">
          <Trophy className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Quiz Leaderboard</h2>
        </div>

        <div className="rounded-xl border p-6 bg-white shadow-md max-h-[400px] overflow-auto">
          {users.length > 0 ? (
            <ul className="space-y-3">
              {users.map((user, index) => {
                const isCurrentUser  = (user.username || '').toLowerCase() === currentUsername;
                return (
                  <li
                    key={index} // Use index as key since userId is hidden
                    className={`flex justify-between items-center px-5 py-3 rounded-lg transition shadow-sm ${
                      isCurrentUser  
                        ? 'bg-blue-100 border border-blue-300 font-semibold'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    title={isCurrentUser  ? "That's you! Keep going!" : `Rank #${index + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getMedal(index + 1)}</span>
                      <span className="text-gray-800">
                        {index + 1}. {user.username}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">{user.totalScore} pts</p>
                      <p className="text-sm text-gray-500">{getFeedbackByRank(index + 1)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center mt-6">No quiz results yet. Be the first to score!</p>
          )}
        </div>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <User  className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-1">Your Progress</h3>
            <p className="text-sm text-blue-600">Keep learning and improve your rank by scoring high on quizzes!</p>
          </div>
        </div>

        {userRank && (
          <div className="mt-6 text-center">
            <p className="text-base text-gray-700 font-medium">
              🔢 You are ranked{' '}
              <span className="font-bold text-blue-700">#{userRank}</span> out of {users.length} players on the leaderboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
