import React from 'react';
import { TrendingUp, BarChart3, FileText, Users, Calendar, Award } from 'lucide-react';

const JournalInsights: React.FC = () => {
  const metrics = {
    impactFactor: 7.6,
    citeScore: 12.4,
    articlesPublished: 1247,
    totalCitations: 18543,
    averageReviewTime: "6.2 weeks",
    acceptanceRate: "32%"
  };

  const recentTrends = [
    {
      metric: "Article Downloads",
      value: "+24%",
      period: "Last 6 months",
      trend: "up"
    },
    {
      metric: "International Submissions",
      value: "+18%",
      period: "Last year",
      trend: "up"
    },
    {
      metric: "Average Review Time",
      value: "-15%",
      period: "Last year",
      trend: "down"
    },
    {
      metric: "Open Access Articles",
      value: "+42%",
      period: "Last year",
      trend: "up"
    }
  ];

  const topTopics = [
    { topic: "Edge Computing", articles: 234, growth: "+28%" },
    { topic: "IoT Security", articles: 198, growth: "+22%" },
    { topic: "Smart Cities", articles: 167, growth: "+35%" },
    { topic: "Industrial IoT", articles: 145, growth: "+19%" },
    { topic: "Healthcare IoT", articles: 132, growth: "+31%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Journal Insights</h1>
          <p className="text-gray-600">
            Key metrics, trends, and statistics about Internet of Things journal
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-yellow-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{metrics.impactFactor}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Impact Factor</h3>
            <p className="text-sm text-gray-600">2024 Journal Citation Reports</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-blue-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{metrics.citeScore}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">CiteScore</h3>
            <p className="text-sm text-gray-600">2024 Scopus Metrics</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="text-green-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{metrics.articlesPublished.toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Articles Published</h3>
            <p className="text-sm text-gray-600">Since journal inception</p>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="text-brand-blue" size={28} />
            Recent Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentTrends.map((trend, idx) => (
              <div key={idx} className="border-l-4 border-brand-blue pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{trend.metric}</h3>
                  <span className={`text-xl font-bold ${trend.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                    {trend.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{trend.period}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Research Topics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="text-purple-600" size={28} />
            Top Research Topics
          </h2>
          <div className="space-y-4">
            {topTopics.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.topic}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{item.articles} articles</span>
                    <span className="text-green-600 font-semibold">{item.growth}</span>
                  </div>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-brand-blue h-2 rounded-full" 
                    style={{ width: `${(item.articles / 250) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="text-brand-blue" size={24} />
              Editorial Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Review Time</span>
                <span className="font-semibold text-gray-900">{metrics.averageReviewTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acceptance Rate</span>
                <span className="font-semibold text-gray-900">{metrics.acceptanceRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Citations</span>
                <span className="font-semibold text-gray-900">{metrics.totalCitations.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="text-brand-orange" size={24} />
              Publication Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Time to First Decision</span>
                <span className="font-semibold text-gray-900">3.5 weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time to Publication</span>
                <span className="font-semibold text-gray-900">8.2 weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Open Access Rate</span>
                <span className="font-semibold text-gray-900">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalInsights;

