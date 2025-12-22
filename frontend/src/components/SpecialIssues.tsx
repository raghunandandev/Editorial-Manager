import React from 'react';
import { specialIssues } from '../data/mockData';
import SpecialIssueCard from './SpecialIssueCard';
import { ChevronRight } from 'lucide-react';

const SpecialIssues: React.FC = () => {
  return (
    <div>
      <div className="border-b border-gray-300 pb-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Special issues and article collections</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specialIssues.map((issue, index) => (
          <SpecialIssueCard key={index} issue={issue} />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        <button className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-blue-dark transition-colors text-sm">
          View all special issues and article collections <ChevronRight size={18} />
        </button>
        <button className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-blue-dark transition-colors text-sm">
          View all issues <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SpecialIssues;
