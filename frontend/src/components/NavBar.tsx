import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const tabs = [
  { name: "Articles & Issues", dropdown: true },
  { name: "About", dropdown: true },
  { name: "Publish", dropdown: true },
  { name: "Journals & Books", dropdown: false },
  // { name: "Order journal", dropdown: false },
];

const NavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const userStored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const currentRole = typeof window !== 'undefined' ? localStorage.getItem('currentRole') : null;
  const [profile, setProfile] = React.useState(userStored);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch fresh profile on mount / when token changes to ensure navbar reflects linked providers immediately
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const resp: any = await authAPI.getProfile();
        const userFromApi = resp?.data?.user || resp?.data || resp?.user || resp;
        if (userFromApi) {
          setProfile(userFromApi);
          try { localStorage.setItem('user', JSON.stringify(userFromApi)); } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    };
    fetchProfile();
    // listen for auth changes (login, provider link) from other components
    window.addEventListener('auth_updated', fetchProfile as EventListener);
    return () => {
      window.removeEventListener('auth_updated', fetchProfile as EventListener);
    };
  }, [token]);

  const linkedProviders = React.useMemo(() => {
    try {
      return (profile?.providers || []).map((p: any) => p.provider);
    } catch (e) {
      return [];
    }
  }, [profile]);


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
                {tab.dropdown ? (
                  <>
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
                    {/* Dropdown menu */}
                    {activeTab === tab.name && dropdownItems[tab.name] && (
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
                  </>
                ) : (
                  <Link
                    to={tab.name === "Journals & Books" ? "/journals-and-books" : "#"}
                    className={`py-4 px-3 inline-flex items-center text-sm transition-colors gap-1
                      ${
                        activeTab === tab.name
                          ? 'font-bold text-gray-800'
                          : 'font-medium text-gray-600 hover:text-brand-blue'
                      }`}
                  >
                    {tab.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
             {/* <div className="relative">
                <input type="text" placeholder="Search in this journal" className="border rounded-md py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div> */}
            {/* <a href="submit-article" className="text-brand-blue hover:underline">Submit your article</a> */}
            <Link to="/guide_for_authors" className="text-brand-blue hover:underline">Guide for authors</Link>
            {/* Role-based dashboard links */}
            {(currentRole === 'editor' || profile?.roles?.editor) && (
              <Link to="/editor-dashboard" className="text-gray-700 hover:underline">Editor Dashboard</Link>
            )}
            {(currentRole === 'editorInChief' || profile?.roles?.editorInChief) && (
              <Link to="/admin-dashboard" className="text-gray-700 hover:underline">Admin Dashboard</Link>
            )}
            {/* ORCID / Email verification buttons & status */}
            {profile && (
              <div className="flex items-center gap-3">
                {/* ORCID status or verify button (authors only) */}
                {profile.roles?.author && (
                  profile.orcidVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">ORCID verified</span>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          const resp: any = await authAPI.getOrcidLinkUrl();
                          const url = resp?.url || resp?.data?.url;
                          if (url) {
                            window.location.href = url;
                          } else {
                            alert('Unable to initiate ORCID verification.');
                          }
                        } catch (err: any) {
                          if (err.response?.status === 401) {
                            window.location.href = '/login';
                            return;
                          }
                          alert(err.response?.data?.message || 'Failed to start ORCID verification');
                        }
                      }}
                      className="inline-flex items-center py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
                    >
                      Verify with ORCID
                    </button>
                  )
                )}

                {/* Email verification via Google for ORCID-only accounts */}
                {linkedProviders.includes('orcid') && !linkedProviders.includes('google') && !profile.emailVerified && (
                  <button
                    onClick={() => { window.location.href = 'http://localhost:3000/api/auth/google'; }}
                    className="inline-flex items-center py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
                  >
                    Verify email with Google
                  </button>
                )}

                {/* Email verified badge */}
                {profile.emailVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Email verified</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
