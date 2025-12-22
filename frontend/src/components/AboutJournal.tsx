import React from 'react';

const AboutJournal: React.FC = () => {
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">About the journal</h2>
      <p className="text-gray-700 leading-relaxed">
        <span className="font-bold">Internet of Journals; Engineering Cyber Physical Human Systems</span> is a comprehensive journal encouraging cross collaboration between researchers, engineers and practitioners in the field of IoT & Cyber Physical Human Systems. The journal offers a unique platform to exchange scientific information on ...
      </p>
      <a href="#" className="text-brand-blue font-semibold text-sm mt-4 inline-block hover:underline">View full aims & scope</a>
    </div>
  );
};

export default AboutJournal;
