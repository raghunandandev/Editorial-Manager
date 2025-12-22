import React from 'react';
import { BarChart3, TrendingUp, FileText, Award, Users, Clock } from 'lucide-react';

const CompareJournals: React.FC = () => {
  const journals = [
    {
      name: "Internet of Things",
      impactFactor: 7.6,
      citeScore: 12.4,
      acceptanceRate: "32%",
      reviewTime: "6.2 weeks",
      openAccess: "68%",
      articles: 1247,
      color: "border-brand-blue"
    },
    {
      name: "IEEE Internet of Things Journal",
      impactFactor: 10.2,
      citeScore: 15.8,
      acceptanceRate: "25%",
      reviewTime: "8.5 weeks",
      openAccess: "45%",
      articles: 2847,
      color: "border-gray-300"
    },
    {
      name: "ACM Transactions on Internet of Things",
      impactFactor: 5.8,
      citeScore: 9.2,
      acceptanceRate: "38%",
      reviewTime: "7.1 weeks",
      openAccess: "52%",
      articles: 892,
      color: "border-gray-300"
    },
    {
      name: "Future Generation Computer Systems",
      impactFactor: 8.0,
      citeScore: 11.5,
      acceptanceRate: "28%",
      reviewTime: "9.2 weeks",
      openAccess: "58%",
      articles: 2156,
      color: "border-gray-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="text-brand-blue" size={40} />
            Compare Journals
          </h1>
          <p className="text-gray-600">
            Compare Internet of Things journal with other leading journals in the field
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Journal</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <Award className="inline-block mr-2" size={18} />
                    Impact Factor
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <TrendingUp className="inline-block mr-2" size={18} />
                    CiteScore
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    Acceptance Rate
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <Clock className="inline-block mr-2" size={18} />
                    Review Time
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    Open Access
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <FileText className="inline-block mr-2" size={18} />
                    Articles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {journals.map((journal, idx) => (
                  <tr key={idx} className={`${idx === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'} ${journal.color} border-l-4`}>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${idx === 0 ? 'text-brand-blue' : 'text-gray-900'}`}>
                        {journal.name}
                      </span>
                      {idx === 0 && (
                        <span className="ml-2 text-xs bg-brand-blue text-white px-2 py-1 rounded">This Journal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-900">{journal.impactFactor}</td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-900">{journal.citeScore}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{journal.acceptanceRate}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{journal.reviewTime}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{journal.openAccess}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{journal.articles.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Choose This Journal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Internet of Things?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Rapid Publication</h3>
              <p className="text-gray-600 text-sm">
                Average review time of 6.2 weeks ensures your research reaches the community quickly without compromising quality.
              </p>
            </div>
            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">High Open Access Rate</h3>
              <p className="text-gray-600 text-sm">
                68% of articles are published open access, maximizing visibility and impact of your research.
              </p>
            </div>
            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Strong Impact Metrics</h3>
              <p className="text-gray-600 text-sm">
                Impact Factor of 7.6 and CiteScore of 12.4 demonstrate the journal's recognition and influence in the field.
              </p>
            </div>
            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600 text-sm">
                Covers the full spectrum of IoT research from theory to applications, including societal aspects.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Note on Metrics</h3>
          <p className="text-blue-800 text-sm">
            Journal metrics are updated annually. Impact Factor data is from 2024 Journal Citation Reports (Clarivate Analytics), 
            and CiteScore data is from 2024 Scopus metrics. Review times and acceptance rates are based on 2024 data. 
            These metrics should be considered alongside other factors such as scope, editorial quality, and fit for your research.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompareJournals;

