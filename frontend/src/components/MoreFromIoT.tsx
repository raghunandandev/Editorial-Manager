import React from 'react';
import { ChevronRight } from 'lucide-react';

const MoreFromIoT: React.FC = () => {
  return (
    <div>
      <div className="border-b border-gray-300 pb-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800">More from Internet of Things</h2>
      </div>
      <div className="bg-white p-6 border border-gray-200 rounded-md">
        <button className="text-sm font-semibold text-gray-700 border-b-2 border-gray-700 pb-1">News</button>
        <p className="text-xs text-gray-500 mt-4">20 November 2025</p>
        <h3 className="text-lg font-bold text-brand-blue hover:underline cursor-pointer mt-1">
          Guidelines for submitting proposals for journal Special Issues
        </h3>
      </div>
      <button className="mt-6 bg-brand-blue text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-blue-dark transition-colors text-sm">
        View all news <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default MoreFromIoT;
