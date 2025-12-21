import React from 'react';
import { CallForPaper } from '../data/mockData';

interface CallForPaperCardProps {
  call: CallForPaper;
}

const CallForPaperCard: React.FC<CallForPaperCardProps> = ({ call }) => {
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-md flex flex-col h-full">
      <h3 className="text-md font-bold text-brand-blue hover:underline cursor-pointer">
        {call.title}
      </h3>
      <p className="text-xs text-gray-500 mt-2">{call.editors}</p>
      <p className="text-sm text-gray-700 mt-4 flex-grow">{call.description}</p>
      <p className="text-sm font-semibold text-gray-800 mt-4">Submission deadline: {call.deadline}</p>
    </div>
  );
};

export default CallForPaperCard;
