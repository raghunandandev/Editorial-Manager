import React from 'react';
import { Calendar, Users, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpecialIssues: React.FC = () => {
  const specialIssues = [
    {
      id: 1,
      title: "AI-Driven IoT Systems for Healthcare",
      guestEditors: "Prof. John Smith, Dr. Maria Garcia",
      submissionDeadline: "2025-03-31",
      publicationDate: "2025-09-01",
      description: "This special issue focuses on the integration of artificial intelligence with IoT technologies to revolutionize healthcare delivery, patient monitoring, and medical diagnostics.",
      topics: [
        "AI-powered medical devices",
        "Remote patient monitoring",
        "Predictive healthcare analytics",
        "IoT in telemedicine"
      ],
      status: "Open for Submissions"
    },
    {
      id: 2,
      title: "Sustainable IoT Solutions for Smart Cities",
      guestEditors: "Dr. Sarah Chen, Prof. Michael Zhang",
      submissionDeadline: "2025-02-28",
      publicationDate: "2025-07-01",
      description: "Exploring innovative IoT applications that contribute to urban sustainability, energy efficiency, and environmental conservation in smart city ecosystems.",
      topics: [
        "Energy-efficient IoT networks",
        "Environmental monitoring systems",
        "Smart waste management",
        "Sustainable transportation"
      ],
      status: "Open for Submissions"
    },
    {
      id: 3,
      title: "Security and Privacy in Industrial IoT",
      guestEditors: "Prof. Robert Brown, Dr. Emily Davis",
      submissionDeadline: "2024-12-31",
      publicationDate: "2025-05-01",
      description: "Addressing critical security challenges and privacy concerns in industrial IoT deployments, including manufacturing, energy, and critical infrastructure sectors.",
      topics: [
        "Industrial IoT security frameworks",
        "Privacy-preserving protocols",
        "Threat detection and mitigation",
        "Blockchain for IoT security"
      ],
      status: "Under Review"
    },
    {
      id: 4,
      title: "Edge Computing and Fog Networks in IoT",
      guestEditors: "Dr. Amanda Taylor, Prof. Christopher Lee",
      submissionDeadline: "2024-11-30",
      publicationDate: "2025-04-01",
      description: "Investigating edge and fog computing paradigms to enable low-latency, high-performance IoT applications across various domains.",
      topics: [
        "Edge intelligence",
        "Fog computing architectures",
        "Distributed processing",
        "Latency optimization"
      ],
      status: "Published"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open for Submissions":
        return "bg-green-100 text-green-800 border-green-200";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Published":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Special Issues and Article Collections</h1>
          <p className="text-gray-600">
            Themed collections of articles focusing on specific topics or emerging research areas
          </p>
        </div>

        {/* Special Issues List */}
        <div className="space-y-6">
          {specialIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-purple-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">{issue.title}</h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span><strong>Guest Editors:</strong> {issue.guestEditors}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{issue.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Topics Covered:</h3>
                    <div className="flex flex-wrap gap-2">
                      {issue.topics.map((topic, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span><strong>Submission Deadline:</strong> {new Date(issue.submissionDeadline).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span><strong>Expected Publication:</strong> {new Date(issue.publicationDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
                <span className={`ml-4 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                {issue.status === "Open for Submissions" && (
                  <Link 
                    to="/submit-manuscript" 
                    className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Submit Article
                    <ArrowRight size={16} />
                  </Link>
                )}
                <button className="flex items-center gap-2 text-brand-blue hover:text-brand-orange transition-colors">
                  View Details
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call for Proposals */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Propose a Special Issue</h3>
          <p className="text-purple-800 mb-4">
            We welcome proposals for special issues on emerging topics in Internet of Things and Cyber Physical Human Systems. 
            Special issue proposals should align with the journal's aims and scope and address timely, important research themes.
          </p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors">
            Submit Special Issue Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialIssues;

