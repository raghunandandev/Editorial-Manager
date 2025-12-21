import React from 'react';
import { Info } from 'lucide-react';
import { timelineStats } from '../data/mockData';

const Timeline: React.FC = () => {
  return (
    <section className="py-8 w-full bg-white">
      <div className="flex flex-col md:flex-row items-stretch w-full">
        {timelineStats.map((stat, index) => (
          <div key={index} className={`flex-1 text-center md:text-left md:border-l-2 border-gray-300 pl-4 flex flex-col justify-center`}>
            <div className="flex items-center justify-center md:justify-start gap-1">
              <p className="text-3xl font-bold text-brand-blue">{stat.value}</p>
              <Info size={16} className="text-gray-400 cursor-pointer" />
            </div>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            
          </div>
        ))}
        {/* View all insights button inline after last stat */}
        <div className="flex items-center justify-center md:justify-start pl-4">
          <a href="#" className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded font-semibold hover:bg-brand-blue-dark transition-colors text-sm whitespace-nowrap">
            <span>View all insights</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
