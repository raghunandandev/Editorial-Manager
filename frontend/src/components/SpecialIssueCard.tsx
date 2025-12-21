import React from 'react';
import { SpecialIssue } from '../data/mockData';

interface SpecialIssueCardProps {
  issue: SpecialIssue;
}

const SpecialIssueCard: React.FC<SpecialIssueCardProps> = ({ issue }) => {
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-md">
      <h3 className="text-md font-bold text-brand-blue hover:underline cursor-pointer">
        {issue.title}
      </h3>
      <p className="text-xs text-gray-500 mt-2">{issue.editors}</p>
      <p className="text-sm font-semibold text-gray-800 mt-4">{issue.date}</p>
    </div>
  );
};

export default SpecialIssueCard;
