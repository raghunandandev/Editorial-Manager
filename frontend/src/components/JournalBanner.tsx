import React from 'react';

const JournalBanner: React.FC = () => {
  // Tooltip descriptions
  const citeScoreDesc = `CiteScore measures the average citations received per peer-reviewed document published in this title. CiteScore values are based on citation counts in a range of four years (e.g. 2021-2024) to peer-reviewed documents (articles, reviews, conference papers, data papers and book chapters) published in the same four calendar years, divided by the number of these documents in these same four years (e.g. 2021 – 24).\n\nView details on Scopus`;
  const impactFactorDesc = `The Impact Factor measures the average number of citations received in a particular year by papers published in the journal during the two preceding years. 2024 Journal Citation Reports (Clarivate Analytics, 2025)`;

  return (
    <section className="bg-brand-blue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 hidden sm:block">
              <img src="https://i.ibb.co/6rC6Pz2/iot-cover.png" alt="Internet of Things Journal Cover" className="h-32 w-auto" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cursor-pointer hover:underline">Internet of Things</h1>
              <p className="mt-2 text-lg text-gray-300 cursor-pointer hover:underline">Supports open access</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-8 mt-6 md:mt-0 text-right">
            {/* CiteScore Tooltip */}
            <div className="relative group">
              <p className="font-bold text-2xl">12.4</p>
              <p className="text-sm text-gray-300 cursor-pointer group-hover:underline" tabIndex={0}>
                CiteScore
              </p>
              <div className="absolute right-0 mt-2 w-80 z-50 hidden group-hover:block bg-white text-gray-900 p-4 rounded shadow-lg text-xs border border-gray-200 whitespace-pre-line">
                {citeScoreDesc}
              </div>
            </div>
            {/* Impact Factor Tooltip */}
            <div className="relative group">
              <p className="font-bold text-2xl">7.6</p>
              <p className="text-sm text-gray-300 cursor-pointer group-hover:underline" tabIndex={0}>
                Impact Factor
              </p>
              <div className="absolute right-0 mt-2 w-80 z-50 hidden group-hover:block bg-white text-gray-900 p-4 rounded shadow-lg text-xs border border-gray-200 whitespace-pre-line">
                {impactFactorDesc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalBanner;
