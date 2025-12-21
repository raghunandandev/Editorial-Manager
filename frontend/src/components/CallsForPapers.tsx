import React from 'react';
import { callsForPapers } from '../data/mockData';
import CallForPaperCard from './CallForPaperCard';
import { ChevronRight } from 'lucide-react';

const CallsForPapers: React.FC = () => {
  return (
    <div>
      <div className="border-b border-gray-300 pb-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Calls for papers</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {callsForPapers.map((call, index) => (
          <CallForPaperCard key={index} call={call} />
        ))}
      </div>
      <button className="mt-6 bg-brand-blue text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-blue-dark transition-colors text-sm">
        View all calls for papers for special issues <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default CallsForPapers;
