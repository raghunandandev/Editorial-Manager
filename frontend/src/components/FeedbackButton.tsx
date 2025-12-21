import React from 'react';

const FeedbackButton: React.FC = () => {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 bg-brand-teal text-white font-bold text-sm py-3 px-6 rounded-md shadow-lg hover:opacity-90 transition-all"
      style={{ minWidth: '120px' }}
    >
      FEEDBACK
    </button>
  );
};

export default FeedbackButton;