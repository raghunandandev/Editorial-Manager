import React, { useState } from "react";

const issues = [
  { year: 2026, volumes: "Volume 35" },
  { year: 2025, volumes: "Volumes 29-34" },
  { year: 2024, volumes: "Volumes 25-28" },
  { year: 2023, volumes: "Volumes 21-24" },
  { year: 2022, volumes: "Volumes 17-20" },
  { year: 2021, volumes: "Volumes 13-16" },
  { year: 2020, volumes: "Volumes 9-12" },
  { year: 2019, volumes: "Volumes 5-8" },
  { year: 2018, volumes: "Volumes 1-4" },
];

const AllIssues: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full min-h-screen bg-white flex">
      {/* Left side: Title */}
      <div className="w-full md:w-1/3 flex items-start justify-center pt-16">
        <h1 className="text-4xl font-semibold text-gray-700">All issues</h1>
      </div>
      {/* Right side: Issues List and About section */}
      <div className="w-full md:w-2/3 flex flex-col justify-start pt-16 pr-16">
        {/* Issues List */}
        {issues.map((issue, idx) => (
          <div key={idx} className="border-b border-gray-300">
            <button
              className={`w-full flex justify-between items-center py-4 px-4 text-lg text-gray-700 rounded-lg transition-all duration-200 shadow-sm border border-gray-200 bg-white hover:bg-blue-50 hover:text-brand-blue focus:outline-none ${openIndex === idx ? 'ring-2 ring-brand-orange' : ''}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span>{issue.year} — {issue.volumes}</span>
              <span
                className={`ml-2 transition-transform duration-200 ${openIndex === idx ? 'rotate-180 text-brand-orange' : 'text-brand-blue'}`}
                style={{ display: 'inline-block' }}
              >
                ▼
              </span>
            </button>
            {openIndex === idx && (
              <div className="py-4 pl-4 text-gray-600">
                {/* Dropdown content goes here. Tell me what to add! */}
                <em>Dropdown content for {issue.year}</em>
              </div>
            )}
          </div>
        ))}
        {/* About this publication section - directly below issues */}
        <div className="pt-8 pb-24">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">About this publication</h2>
          <div className="text-gray-700 mb-1">ISSN: 2542-6605</div>
          <div className="text-gray-600 text-sm">
            Copyright &copy; 2025 Elsevier B.V. All rights are reserved, including those for text and data mining, AI training, and similar technologies.
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllIssues;
