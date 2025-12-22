import React from 'react';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

const News: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: "Journal Impact Factor Reaches New High",
      date: "2024-12-10",
      category: "Announcement",
      summary: "Internet of Things journal achieves an Impact Factor of 7.6, marking a significant milestone in the journal's growth and recognition in the research community.",
      content: "We are pleased to announce that Internet of Things has achieved an Impact Factor of 7.6 in the 2024 Journal Citation Reports. This represents a substantial increase from the previous year and reflects the high quality of research published in the journal. We extend our gratitude to all authors, reviewers, and editors who have contributed to this success."
    },
    {
      id: 2,
      title: "New Special Issue: AI-Driven IoT Systems for Healthcare",
      date: "2024-12-05",
      category: "Special Issue",
      summary: "Call for papers for a new special issue focusing on the integration of artificial intelligence with IoT technologies in healthcare applications.",
      content: "We are excited to announce a new special issue on 'AI-Driven IoT Systems for Healthcare'. This special issue will explore cutting-edge research at the intersection of AI and IoT in healthcare, including remote patient monitoring, predictive analytics, and intelligent medical devices. Submission deadline: March 31, 2025."
    },
    {
      id: 3,
      title: "Editorial Board Expansion",
      date: "2024-11-20",
      category: "Editorial",
      summary: "We welcome three new Associate Editors to strengthen our editorial team and expand our coverage of emerging IoT research areas.",
      content: "The journal is pleased to welcome three distinguished researchers as new Associate Editors: Prof. Sarah Chen (MIT), Prof. Michael Zhang (Cambridge), and Prof. Maria Garcia (Technical University of Madrid). Their expertise will enhance our coverage of edge computing, wireless networks, and smart city applications."
    },
    {
      id: 4,
      title: "Open Access Week 2024: Increased OA Options",
      date: "2024-10-23",
      category: "Open Access",
      summary: "In celebration of Open Access Week, we highlight our commitment to open science and expanded open access publishing options.",
      content: "During Open Access Week 2024, we reaffirm our commitment to making research accessible. The journal now offers multiple open access options, and over 68% of our published articles are available open access. We continue to support authors in choosing the best publication model for their research."
    },
    {
      id: 5,
      title: "Best Paper Awards 2024",
      date: "2024-09-15",
      category: "Awards",
      summary: "Announcing the recipients of the 2024 Best Paper Awards, recognizing outstanding contributions to IoT research.",
      content: "We are delighted to announce the winners of the 2024 Best Paper Awards. The awards recognize papers published in 2023 that have made significant contributions to the field of Internet of Things. Winners will be honored at the upcoming IoT Conference in 2025."
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Announcement":
        return "bg-blue-100 text-blue-800";
      case "Special Issue":
        return "bg-purple-100 text-purple-800";
      case "Editorial":
        return "bg-green-100 text-green-800";
      case "Open Access":
        return "bg-orange-100 text-orange-800";
      case "Awards":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Newspaper className="text-brand-blue" size={40} />
            News & Announcements
          </h1>
          <p className="text-gray-600">
            Stay updated with the latest news, announcements, and developments from Internet of Things journal
          </p>
        </div>

        {/* News Items */}
        <div className="space-y-6">
          {newsItems.map((item) => (
            <article key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{new Date(item.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-brand-blue cursor-pointer">
                    {item.title}
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">{item.summary}</p>
                  <p className="text-gray-600 leading-relaxed">{item.content}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-brand-blue hover:text-brand-orange transition-colors mt-4">
                Read More
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 bg-brand-blue text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
          <p className="mb-4 text-blue-100">
            Subscribe to our newsletter to receive the latest news, special issue announcements, and journal updates directly in your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-brand-blue px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;

