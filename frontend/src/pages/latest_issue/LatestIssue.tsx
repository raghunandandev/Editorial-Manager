import React, { useState } from "react";
import { Download, Bell, ChevronLeft, ChevronRight, FileText } from "lucide-react";

const researchArticles = [
  {
    title: "LoRaGeo-PSW: a prompt-aligned large language model for few-shot fingerprint geolocation in urban LoRaWAN networks",
    authors: "Wenbin Shi, Zhongxu Zhan, Jingsheng Lei, Xingli Gan",
    articleId: "101821",
    openAccess: true,
  },
  {
    title: "Advanced IoT security framework using blockchain technology",
    authors: "John Doe, Jane Smith, Robert Brown",
    articleId: "101822",
    openAccess: false,
  },
  {
    title: "Machine learning approaches for network optimization in 5G",
    authors: "Alice Johnson, Michael Chen",
    articleId: "101823",
    openAccess: true,
  },
  {
    title: "Energy-efficient routing protocols for wireless sensor networks",
    authors: "Sarah Williams, David Martinez, Emily Davis",
    articleId: "101824",
    openAccess: false,
  },
  {
    title: "Edge computing in IoT: A comprehensive survey",
    authors: "Christopher Lee, Amanda Taylor",
    articleId: "101825",
    openAccess: true,
  },
];

const reviewArticles = [
  {
    title: "A survey on deep learning techniques for IoT applications",
    authors: "Michael Zhang, Lisa Wang, Tom Anderson",
    articleId: "101826",
    openAccess: false,
  },
  {
    title: "Security challenges in Internet of Things: A systematic review",
    authors: "Kevin Brown, Rachel Green",
    articleId: "101827",
    openAccess: true,
  },
];

const volumes = [
  { volume: 35, year: 2026, status: "In progress" },
  { volume: 34, year: 2025, status: "Complete" },
  { volume: 33, year: 2025, status: "Complete" },
];

const LatestIssue: React.FC = () => {
  const [currentVolumeIndex, setCurrentVolumeIndex] = useState(0);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [showPreviews, setShowPreviews] = useState(false);

  const currentVolume = volumes[currentVolumeIndex];

  const handlePrevious = () => {
    if (currentVolumeIndex < volumes.length - 1) {
      setCurrentVolumeIndex(currentVolumeIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentVolumeIndex > 0) {
      setCurrentVolumeIndex(currentVolumeIndex - 1);
    }
  };

  const toggleArticle = (articleId: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId);
    } else {
      newSelected.add(articleId);
    }
    setSelectedArticles(newSelected);
  };

  const selectAll = () => {
    const allIds = [...researchArticles, ...reviewArticles].map(a => a.articleId);
    setSelectedArticles(new Set(allIds));
  };

  const deselectAll = () => {
    setSelectedArticles(new Set());
  };

  return (
    <section className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 pt-8 pb-24">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6 pb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-800 mb-1">Volume {currentVolume.volume}</h1>
            <div className="text-gray-500 italic mb-2">
              {currentVolume.status} {currentVolume.status === "In progress" && `(January ${currentVolume.year})`}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              This issue is in progress but contains articles that are final and fully citable.
            </div>
            <button className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-blue-700 transition">
              <Download size={16} /> Download full issue
            </button>
          </div>
          <div className="flex gap-3 pt-1">
            <button 
              onClick={handlePrevious}
              disabled={currentVolumeIndex >= volumes.length - 1}
              className={`flex items-center gap-1 text-sm px-3 py-2 rounded transition ${
                currentVolumeIndex >= volumes.length - 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-brand-blue hover:bg-blue-50'
              }`}
            >
              <ChevronLeft size={18} /> Previous vol/issue
            </button>
            <button 
              onClick={handleNext}
              disabled={currentVolumeIndex <= 0}
              className={`flex items-center gap-1 text-sm px-3 py-2 rounded transition ${
                currentVolumeIndex <= 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-brand-blue hover:bg-blue-50'
              }`}
            >
              Next vol/issue <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Main Content with Sidebar Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Actions and Contents */}
          <div className="w-full md:w-1/4 flex flex-col gap-8">
            {/* Actions for selected articles */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Actions for selected articles</h2>
              <div className="flex gap-2 text-sm mb-3">
                <button onClick={selectAll} className="text-brand-blue hover:underline">Select all</button>
                <span className="text-gray-400">/</span>
                <button onClick={deselectAll} className="text-gray-600 hover:underline">Deselect all</button>
              </div>
              <button 
                disabled={selectedArticles.size === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium mb-2 w-full justify-center transition ${
                  selectedArticles.size === 0 
                    ? 'bg-brand-blue text-white cursor-default'
                    : 'bg-brand-blue text-white hover:bg-blue-700'
                }`}
              >
                <Download size={16} /> Download PDFs
              </button>
              <button 
                disabled
                className="flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded text-sm font-medium mb-4 w-full justify-center cursor-not-allowed"
              >
                <Download size={16} /> Export citations
              </button>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="show-previews" 
                  checked={showPreviews}
                  onChange={(e) => setShowPreviews(e.target.checked)}
                  className="w-4 h-4 accent-brand-blue cursor-pointer"
                />
                <label htmlFor="show-previews" className="text-gray-700 text-sm cursor-pointer">
                  Show all article previews
                </label>
              </div>
            </div>

            {/* Contents */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">Contents</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>
                  <a href="#research" className="hover:text-brand-blue">Research articles</a>
                </li>
                <li>
                  <a href="#review" className="hover:text-brand-blue">Review articles</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="w-full md:w-3/4">
            {/* Alert Section */}
            <div className="mb-8 pb-8 border-b border-gray-300">
              <p className="text-gray-700 text-sm mb-3">
                Receive an update when the latest issues in this journal are published
              </p>
              <button className="flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-blue-700 transition">
                <Bell size={16} /> Sign in to set up alerts
              </button>
            </div>
            {/* Research Articles */}
            <div id="research" className="mb-10">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 italic">Research articles</h4>
              <hr className="border-gray-300 mb-6" />
              {researchArticles.map((article) => (
                <div key={article.articleId} className="mb-6 pb-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.articleId)}
                      onChange={() => toggleArticle(article.articleId)}
                      className="mt-1 w-4 h-4 accent-brand-blue cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-600">Research article</span>
                        {article.openAccess && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-green-600 font-medium">Open access</span>
                          </>
                        )}
                      </div>
                      <h5 className="text-base font-semibold text-gray-800 mb-2 leading-tight hover:text-brand-blue cursor-pointer">
                        {article.title}
                      </h5>
                      <div className="text-sm text-gray-600 mb-1">{article.authors}</div>
                      <div className="text-xs text-gray-500 mb-3">Article {article.articleId}</div>
                      <div className="flex gap-4 items-center text-sm">
                        <a href="#" className="flex items-center gap-1 text-red-600 hover:underline">
                          <FileText size={14} /> View PDF
                        </a>
                        <button className="flex items-center gap-1 text-brand-blue hover:underline">
                          Article preview <ChevronLeft size={14} className="rotate-[-90deg]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Articles */}
            <div id="review">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 italic">Review articles</h4>
              <hr className="border-gray-300 mb-6" />
              {reviewArticles.map((article) => (
                <div key={article.articleId} className="mb-6 pb-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedArticles.has(article.articleId)}
                      onChange={() => toggleArticle(article.articleId)}
                      className="mt-1 w-4 h-4 accent-brand-blue cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-600">Review article</span>
                        {article.openAccess && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-green-600 font-medium">Open access</span>
                          </>
                        )}
                      </div>
                      <h5 className="text-base font-semibold text-gray-800 mb-2 leading-tight hover:text-brand-blue cursor-pointer">
                        {article.title}
                      </h5>
                      <div className="text-sm text-gray-600 mb-1">{article.authors}</div>
                      <div className="text-xs text-gray-500 mb-3">Article {article.articleId}</div>
                      <div className="flex gap-4 items-center text-sm">
                        <a href="#" className="flex items-center gap-1 text-red-600 hover:underline">
                          <FileText size={14} /> View PDF
                        </a>
                        <button className="flex items-center gap-1 text-brand-blue hover:underline">
                          Article preview <ChevronLeft size={14} className="rotate-[-90deg]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestIssue;
