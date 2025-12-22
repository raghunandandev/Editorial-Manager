import React from 'react';
import { FileText, Calendar, User, Download } from 'lucide-react';

const ArticlesInPress: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "Edge Intelligence for IoT: A Comprehensive Framework",
      authors: "Dr. Sarah Chen, Prof. Michael Zhang, Dr. Lisa Wang",
      type: "Research Article",
      acceptedDate: "2024-12-15",
      abstract: "This paper presents a novel framework for implementing edge intelligence in Internet of Things ecosystems, focusing on real-time data processing and decision-making capabilities."
    },
    {
      id: 2,
      title: "Blockchain-Based Security Architecture for Industrial IoT",
      authors: "Prof. Robert Brown, Dr. Emily Davis, Dr. James Wilson",
      type: "Research Article",
      acceptedDate: "2024-12-10",
      abstract: "We propose a decentralized security architecture leveraging blockchain technology to enhance trust and security in industrial IoT environments."
    },
    {
      id: 3,
      title: "Machine Learning-Driven Resource Optimization in 5G Networks",
      authors: "Dr. Amanda Taylor, Prof. Christopher Lee",
      type: "Review Article",
      acceptedDate: "2024-12-05",
      abstract: "A comprehensive review of machine learning approaches for optimizing resource allocation and network performance in 5G-enabled IoT systems."
    },
    {
      id: 4,
      title: "Sustainable IoT Solutions for Smart Cities",
      authors: "Dr. Maria Garcia, Prof. David Martinez, Dr. Anna Rodriguez",
      type: "Research Article",
      acceptedDate: "2024-11-28",
      abstract: "This study explores sustainable IoT implementations that contribute to energy efficiency and environmental conservation in urban environments."
    },
    {
      id: 5,
      title: "Privacy-Preserving Data Analytics in IoT Networks",
      authors: "Prof. Kevin Brown, Dr. Rachel Green, Dr. Tom Anderson",
      type: "Research Article",
      acceptedDate: "2024-11-20",
      abstract: "We introduce a novel privacy-preserving framework that enables secure data analytics while maintaining user privacy in large-scale IoT deployments."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Articles in Press</h1>
          <p className="text-gray-600">
            Articles that have been accepted for publication but have not yet been published in a volume/issue
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-blue-600" size={20} />
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {article.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-brand-blue cursor-pointer">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{article.authors}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Accepted: {new Date(article.acceptedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{article.abstract}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-brand-blue hover:text-brand-orange transition-colors">
                  <Download size={16} />
                  View Abstract
                </button>
                <span className="text-sm text-gray-500">Available online soon</span>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Articles in Press</h3>
          <p className="text-blue-800">
            Articles in Press are peer-reviewed, accepted articles that are not yet assigned to an issue. 
            These articles are published online as soon as they are accepted and will be assigned to the next available issue. 
            Articles in Press are fully citable and searchable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticlesInPress;

