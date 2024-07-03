import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-blue-500 mb-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
