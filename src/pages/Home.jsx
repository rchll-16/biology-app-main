import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../firebaseConfig';
import { ref, set, get, child, remove } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loginError, setLoginError] = useState('');
  const [completedLessons, setCompletedLessons] = useState({});
  const inputRef = useRef(null);

  const generateUserId = () => 'user_' + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setLoggedInUser(savedUsername);
      fetchCompletedLessons(savedUsername);
    } else {
      openUserListModal();
    }
  }, []);

  useEffect(() => {
    if ((showCreateModal || showLoginModal) && inputRef.current) inputRef.current.focus();
  }, [showCreateModal, showLoginModal]);

  const fetchCompletedLessons = async (username) => {
    try {
      const userRef = ref(database, `users/${username}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setCompletedLessons(userData.completedLessons || {});
      }
    } catch (err) {
      console.error('Failed to fetch completed lessons:', err);
    }
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setUsername('');
    setPassword('');
  };

  const openUserListModal = async () => {
    try {
      const snapshot = await get(child(ref(database), 'users'));
      if (snapshot.exists()) {
        setUserList(Object.keys(snapshot.val()));
      } else {
        setUserList([]);
      }
      setShowUserListModal(true);
    } catch (err) {
      console.error('Failed to fetch user list:', err);
      alert('Failed to load user list.');
    }
  };

  const closeUserListModal = () => setShowUserListModal(false);

  const openLoginModal = (user) => {
    setSelectedUser(user);
    setLoginPassword('');
    setLoginError('');
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setSelectedUser('');
    setLoginPassword('');
    setLoginError('');
  };

  const handleCreateUser = async () => {
    if (!username.trim() || !password.trim()) {
      alert('Please enter username and password');
      return;
    }
    try {
      const userRef = ref(database, 'users/' + username);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        alert('Username already exists. Please choose another.');
        return;
      }
      const userId = generateUserId();
      const totalLessons = 5;
      const initialCompletedLessons = {};
      for (let i = 1; i <= totalLessons; i++) {
        initialCompletedLessons[`lesson${i}`] = null;
      }
      await set(userRef, {
        userId,
        username,
        password,
        points: 0,
        completedLessons: initialCompletedLessons,
      });
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);
      setLoggedInUser(username);
      closeCreateModal();
      closeUserListModal();
      alert('User created successfully!');
    } catch (err) {
      console.error('Failed to create user:', err);
      alert('Failed to create user.');
    }
  };

  const handleSelectUser = (user) => {
    openLoginModal(user);
  };

  const handleLogin = async () => {
    if (!loginPassword.trim()) {
      setLoginError('Please enter password');
      return;
    }
    try {
      const userRef = ref(database, 'users/' + selectedUser);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        setLoginError('User does not exist.');
        return;
      }
      const userData = snapshot.val();
      if (userData.password === loginPassword) {
        localStorage.setItem('username', selectedUser);
        localStorage.setItem('userId', userData.userId || '');
        setLoggedInUser(selectedUser);
        setCompletedLessons(userData.completedLessons || {});
        closeLoginModal();
        closeUserListModal();
      } else {
        setLoginError('Incorrect password. Try again.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Switch user?')) {
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      setLoggedInUser('');
      setUsername('');
      openUserListModal();
    }
  };

  // Delete user handler
  const handleDeleteUser = async (usernameToDelete) => {
    if (!window.confirm(`Are you sure you want to delete user "${usernameToDelete}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await remove(ref(database, `users/${usernameToDelete}`));
      // If the deleted user is the logged in user, log them out
      if (loggedInUser === usernameToDelete) {
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setLoggedInUser('');
      }
      // Refresh user list
      const snapshot = await get(child(ref(database), 'users'));
      if (snapshot.exists()) {
        setUserList(Object.keys(snapshot.val()));
      } else {
        setUserList([]);
      }
      alert(`User "${usernameToDelete}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={loggedInUser ? handleLogout : openUserListModal}
        className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        {loggedInUser ? 'Switch User' : 'Login'}
      </button>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 animate-scaleIn">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">Create New User</h2>
            <input
              ref={inputRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
              placeholder="Username e.g., BioMaster123"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-green-500"
              autoComplete="username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-green-500"
              autoComplete="new-password"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCreateUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Submit
              </button>
              <button
                onClick={closeCreateModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User List Modal */}
      {showUserListModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 max-h-[70vh] overflow-y-auto animate-scaleIn">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4 flex justify-between items-center">
              Select User
              <button
                onClick={closeUserListModal}
                aria-label="Close user list"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </h2>
            <ul className="space-y-2">
              {userList.length > 0 ? (
                userList.map((user) => (
                  <li key={user} className="flex justify-between items-center">
                    <button
                      onClick={() => handleSelectUser(user)}
                      className="flex-1 text-left px-4 py-2 bg-gray-100 hover:bg-green-100 rounded transition"
                    >
                      👤 {user}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label={`Delete user ${user}`}
                      title={`Delete user ${user}`}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500">No users found. Please create one.</li>
              )}
            </ul>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  closeUserListModal();
                  openCreateModal();
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 pr-6 rounded-lg transition"
              >
                ➕ Create New User
              </button>
              <button
                onClick={closeUserListModal}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
              >
                ❌ Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 animate-scaleIn">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Login as <span className="font-bold">{selectedUser}</span>
            </h2>
            <input
              ref={inputRef}
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-green-500"
              autoComplete="current-password"
            />
            {loginError && <p className="text-red-600 mb-3">{loginError}</p>}
            <div className="flex justify-between">
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Login
              </button>
              <button
                onClick={closeLoginModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full text-center animate-fadeIn">
        <h1 className="text-4xl font-bold text-green-700 mb-4">🌱 BIO-QUEST</h1>

        {loggedInUser && (
          <p className="text-xl text-gray-700 mb-4">
            Welcome back, <span className="font-bold text-green-800">{loggedInUser}</span>!
          </p>
        )}

        <p className="text-gray-700 mb-6">Choose a lesson to start learning and earning points!</p>

        <div className="space-y-4">
          <Link
            to="/lesson"
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center"
          >
            <span>🧫 The Cell — Structure and Function</span>
          </Link>

          <Link
            to="/leaderboard"
            className="block bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-3 rounded-lg font-medium transition duration-200"
          >
            🔬 View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
