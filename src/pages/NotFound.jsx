import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600">Page Not Found</p>
      <p className="text-gray-500 mt-4">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
        Go to Homepage
      </a>
    </div>
  );
}

export default NotFound;

