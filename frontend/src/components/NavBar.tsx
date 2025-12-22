import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const tabs = [
  { name: "Articles & Issues", dropdown: true },
  { name: "About", dropdown: true },
  { name: "Publish", dropdown: true },
  { name: "Order journal", dropdown: false },
];

const NavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);


  const dropdownItems: Record<string, { text: string; href: string }[]> = {
    "Articles & Issues": [
      { text: "Latest issue", href: "/latest-issue" },
      { text: "All issues", href: "/all-issues" },
      { text: "Articles in press", href: "/articles-in-press" },
      { text: "Special issues and article collections", href: "/special-issues" },
      { text: "Linked datasets", href: "/linked-datasets" },
      { text: "Sign in to set up alerts", href: "/set-up-alerts" },
      { text: "RSS", href: "/rss" },
    ],
    "About": [
      { text: "Aims and scope", href: "/aims-and-scope" },
      { text: "Editorial board", href: "/editorial-board" },
      { text: "Journal insights", href: "/journal-insights" },
      { text: "News", href: "/news" },
      { text: "Editors' Choice", href: "/editors-choice" },
      { text: "Awards", href: "/awards" },
    ],
    "Publish": [
      // { text: "Submit your article", href: "submit-article" },
      { text: "Guide for authors", href: "/guide_for_authors" },
      { text: "Call for papers", href: "/publish/call-for-authors" },
      { text: "Policies and Guidelines", href: "/policies-and-guidelines" },
      { text: "Open access options", href: "/open-access" },
      { text: "Compare journals", href: "/compare-journals" },
      { text: "Language Editing services", href: "/language-editing" },
    ],
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <ul className="flex items-center space-x-1 -mb-px relative">
            {tabs.map((tab) => (
              <li
                key={tab.name}
                className="relative"
                onMouseEnter={() => tab.dropdown ? setActiveTab(tab.name) : setActiveTab(null)}
                onMouseLeave={() => setActiveTab(null)}
              >
                <button
                  className={`py-4 px-3 inline-flex items-center text-sm transition-colors gap-1
                    ${
                      activeTab === tab.name
                        ? 'font-bold text-gray-800'
                        : 'font-medium text-gray-600 hover:text-brand-blue'
                    }`}
                >
                  {tab.name}
                  {tab.dropdown && <ChevronDown size={16} />}
                </button>
                {/* Dropdown menu for first three tabs */}
                {tab.dropdown && activeTab === tab.name && dropdownItems[tab.name] && (
                  <div className="absolute left-0 top-full w-64 bg-white shadow-lg rounded border border-gray-200 z-30">
                    <ul className="py-2">
                      {dropdownItems[tab.name].map((item, idx) => (
                        <li key={idx}>
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                          >
                            {item.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
             <div className="relative">
                <input type="text" placeholder="Search in this journal" className="border rounded-md py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* <a href="submit-article" className="text-brand-blue hover:underline">Submit your article</a> */}
            <Link to="/guide_for_authors" className="text-brand-blue hover:underline">Guide for authors</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
