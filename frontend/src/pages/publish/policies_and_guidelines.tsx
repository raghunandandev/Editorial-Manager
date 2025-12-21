import React from "react";

const PoliciesAndGuidelines: React.FC = () => {
  return (
    <div className="w-full px-6 py-10 max-w-5xl mx-auto">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4">Policies and Guidelines</h1>
      <div className="h-1 w-20 bg-blue-600 mb-10"></div>

      {/* Date */}
      <p className="text-gray-600 mb-6">13 December 2022</p>

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-6">
        Guidelines for submitting proposals for journal Special Issues - Internet of Things
      </h2>

      {/* Content */}
      <p className="text-gray-800 leading-relaxed mb-4">
        Guest Editors, please note: to submit a Special Issue proposal to this journal, please review the following link:
        <a
          href="https://www.elsevier.com/subject/computer-science/special-issue-proposal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline ml-1"
        >
          How to prepare a Special Issue proposal (elsevier.com)
        </a>
        
        for instructions on how to submit to the online system and an overview of the process. Following the initial publisher review, your proposal will be assessed by the relevant journal editor within this site.
      </p>
    </div>
  );
};

export default PoliciesAndGuidelines;
