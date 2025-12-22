import React from 'react';
import { Star, Download, Calendar, User, Award } from 'lucide-react';

const EditorsChoice: React.FC = () => {
  const featuredArticles = [
    {
      id: 1,
      title: "Edge Intelligence for IoT: A Comprehensive Framework",
      authors: "Dr. Sarah Chen, Prof. Michael Zhang, Dr. Lisa Wang",
      publicationDate: "2024-11-15",
      volume: "Volume 34",
      issue: "Issue 3",
      pages: "101234",
      citations: 45,
      reason: "Outstanding contribution to edge computing in IoT with practical implementation framework",
      abstract: "This paper presents a novel comprehensive framework for implementing edge intelligence in Internet of Things ecosystems, focusing on real-time data processing and decision-making capabilities that significantly improve system performance."
    },
    {
      id: 2,
      title: "Blockchain-Based Security Architecture for Industrial IoT",
      authors: "Prof. Robert Brown, Dr. Emily Davis, Dr. James Wilson",
      publicationDate: "2024-10-20",
      volume: "Volume 34",
      issue: "Issue 2",
      pages: "101189",
      citations: 38,
      reason: "Innovative security solution addressing critical challenges in industrial IoT deployments",
      abstract: "We propose a decentralized security architecture leveraging blockchain technology to enhance trust and security in industrial IoT environments, demonstrating significant improvements in attack resistance."
    },
    {
      id: 3,
      title: "Sustainable IoT Solutions for Smart Cities",
      authors: "Dr. Maria Garcia, Prof. David Martinez, Dr. Anna Rodriguez",
      publicationDate: "2024-09-10",
      volume: "Volume 33",
      issue: "Issue 4",
      pages: "101156",
      citations: 52,
      reason: "Excellent work on sustainable IoT applications with real-world impact on urban environments",
      abstract: "This study explores sustainable IoT implementations that contribute to energy efficiency and environmental conservation in urban environments, presenting case studies from multiple smart city deployments."
    },
    {
      id: 4,
      title: "Privacy-Preserving Data Analytics in IoT Networks",
      authors: "Prof. Kevin Brown, Dr. Rachel Green, Dr. Tom Anderson",
      publicationDate: "2024-08-05",
      volume: "Volume 33",
      issue: "Issue 3",
      pages: "101123",
      citations: 41,
      reason: "Novel privacy-preserving techniques with strong theoretical foundations and practical applicability",
      abstract: "We introduce a novel privacy-preserving framework that enables secure data analytics while maintaining user privacy in large-scale IoT deployments, achieving significant improvements in privacy guarantees."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Award className="text-yellow-600" size={40} />
            Editors' Choice
          </h1>
          <p className="text-gray-600">
            Outstanding articles selected by our editors for their exceptional quality, innovation, and impact on the field
          </p>
        </div>

        {/* Featured Articles */}
        <div className="space-y-6">
          {featuredArticles.map((article, idx) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                      Editors' Choice
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.volume}, {article.issue} • Pages {article.pages}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-brand-blue cursor-pointer">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{article.authors}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(article.publicationDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={16} />
                      <span>{article.citations} citations</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{article.abstract}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-1">Why Editors' Choice?</h4>
                    <p className="text-blue-800 text-sm">{article.reason}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                      <Download size={16} />
                      Download Article
                    </button>
                    <button className="text-brand-blue hover:text-brand-orange transition-colors">
                      View Full Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Criteria */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selection Criteria</h3>
          <p className="text-gray-700 mb-4">
            Articles are selected for Editors' Choice based on the following criteria:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Exceptional scientific quality and rigor</li>
            <li>Significant contribution to the field</li>
            <li>Innovative methodology or approach</li>
            <li>Strong potential for impact and citations</li>
            <li>Clarity of presentation and practical relevance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditorsChoice;

