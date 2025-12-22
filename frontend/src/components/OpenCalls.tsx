import React from 'react';

const OpenCalls: React.FC = () => {
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-md flex flex-col md:flex-row items-center justify-between gap-6">
      <img src="https://i.ibb.co/6gq9T5Q/telescope-icon.png" alt="Telescope" className="h-24 w-24" />
      <div className="text-center md:text-left">
        <p className="text-lg text-gray-700">More opportunities to publish your research:</p>
        <a href="#" className="text-2xl font-bold text-brand-blue hover:underline">Browse open Calls for Papers</a>
      </div>
      <img src="https://i.ibb.co/qYdZ9xM/browse-icon.png" alt="Browse" className="h-24 w-24 hidden lg:block" />
    </div>
  );
};

export default OpenCalls;
