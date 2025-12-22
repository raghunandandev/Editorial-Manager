import React from 'react';
import { Trophy, Award, Star, Calendar, Users } from 'lucide-react';

const Awards: React.FC = () => {
  const awards = [
    {
      id: 1,
      title: "Best Paper Award 2024",
      description: "Recognizing the most outstanding research article published in 2023",
      winner: {
        article: "Edge Intelligence for IoT: A Comprehensive Framework",
        authors: "Dr. Sarah Chen, Prof. Michael Zhang, Dr. Lisa Wang",
        year: 2024
      },
      criteria: [
        "Scientific excellence and innovation",
        "Significant contribution to the field",
        "High citation potential",
        "Practical applicability"
      ]
    },
    {
      id: 2,
      title: "Outstanding Reviewer Award 2024",
      description: "Acknowledging reviewers who have provided exceptional peer review contributions",
      winner: {
        article: "Multiple outstanding review contributions",
        authors: "Prof. Robert Brown, Dr. Emily Davis, Prof. Christopher Lee",
        year: 2024
      },
      criteria: [
        "Quality and thoroughness of reviews",
        "Timeliness of review submissions",
        "Constructive feedback to authors",
        "Number of reviews completed"
      ]
    },
    {
      id: 3,
      title: "Early Career Researcher Award 2024",
      description: "Celebrating exceptional contributions from early career researchers",
      winner: {
        article: "Privacy-Preserving Data Analytics in IoT Networks",
        authors: "Dr. Rachel Green (First Author)",
        year: 2024
      },
      criteria: [
        "First or corresponding author",
        "Within 5 years of PhD completion",
        "Outstanding research contribution",
        "Potential for future impact"
      ]
    },
    {
      id: 4,
      title: "Best Special Issue Award 2024",
      description: "Recognizing the most impactful special issue published in 2023",
      winner: {
        article: "Security and Privacy in Industrial IoT",
        authors: "Guest Editors: Prof. Robert Brown, Dr. Emily Davis",
        year: 2024
      },
      criteria: [
        "Coherence and quality of articles",
        "Impact on the research community",
        "Timeliness of the topic",
        "Editorial excellence"
      ]
    }
  ];

  const pastWinners = [
    {
      year: 2023,
      title: "Best Paper Award",
      winner: "Sustainable IoT Solutions for Smart Cities",
      authors: "Dr. Maria Garcia et al."
    },
    {
      year: 2023,
      title: "Outstanding Reviewer Award",
      winner: "Prof. John Smith, Prof. Lisa Wang",
      authors: ""
    },
    {
      year: 2022,
      title: "Best Paper Award",
      winner: "Machine Learning-Driven Resource Optimization",
      authors: "Dr. Amanda Taylor et al."
    },
    {
      year: 2022,
      title: "Early Career Researcher Award",
      winner: "IoT Security Framework",
      authors: "Dr. Tom Anderson"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-600" size={40} />
            Awards & Recognition
          </h1>
          <p className="text-gray-600">
            Celebrating excellence in research, peer review, and contributions to the Internet of Things research community
          </p>
        </div>

        {/* Current Year Awards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2024 Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((award) => (
              <div key={award.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Award className="text-yellow-600" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{award.description}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Winner:</h4>
                  <p className="text-brand-blue font-medium mb-1">{award.winner.article}</p>
                  <p className="text-sm text-gray-600 mb-4">{award.winner.authors}</p>
                  <h4 className="font-semibold text-gray-900 mb-2">Selection Criteria:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {award.criteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Winners */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Award Winners</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {pastWinners.map((winner, idx) => (
                <div key={idx} className="flex items-start justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Star className="text-yellow-500" size={18} />
                      <span className="font-semibold text-gray-900">{winner.year} - {winner.title}</span>
                    </div>
                    <p className="text-brand-blue font-medium ml-6">{winner.winner}</p>
                    {winner.authors && (
                      <p className="text-sm text-gray-600 ml-6">{winner.authors}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Award Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Our Awards</h3>
          <p className="text-blue-800 mb-4">
            Our annual awards program recognizes excellence in research, peer review, and contributions to the IoT research community. 
            Awards are presented at major conferences and events, and winners receive recognition in the journal and on our website.
          </p>
          <p className="text-blue-800">
            <strong>Nomination Process:</strong> Awards are selected by the editorial board based on objective criteria including 
            citation metrics, peer review quality, and editorial assessment. All articles published in the journal are automatically 
            considered for relevant awards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Awards;

