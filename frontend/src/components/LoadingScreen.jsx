import React from 'react';

const LoadingScreen = () => {
  const gif = "http://127.0.0.1:8000/media/assets/loading.gif";
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <img src={gif} alt="Loading..." className="w-32 h-32 mb-4 mx-auto" />
      </div>
    </div>
  );
};

export default LoadingScreen;
