import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const bgColors = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-pink-100 border-pink-500 text-pink-700'
  };

  return (
    <div className={`${bgColors[type]} border-l-4 p-4 mb-4 relative`} role="alert">
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800"
          aria-label="Close alert"
        >
          <span className="text-2xl">&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;