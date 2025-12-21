import React from 'react';

const FooterLinkColumn: React.FC<{ title: string; links: { text: string; href: string }[] }> = ({ title, links }) => (
  <div>
    <h4 className="font-bold mb-3 text-sm text-gray-800">{title}</h4>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href} className="text-sm text-brand-blue hover:underline flex items-center">
            {link.text} <span className="ml-1">›</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const footerLinks = {
    authors: [
      { text: "Resources for authors", href: "#" },
      { text: "Track your accepted paper", href: "#" },
      { text: "Journal Finder", href: "#" },
      { text: "Researcher Academy", href: "#" },
      { text: "Rights and permissions", href: "#" },
      { text: "Journal Article Publishing Support Center", href: "#" },
    ],
    editors: [
      { text: "Resources for editors", href: "#" },
      { text: "Publishing Ethics Resource Kit", href: "#" },
      { text: "Guest editors", href: "#" },
    ],
    reviewers: [
      { text: "Resources for reviewers", href: "#" },
      { text: "Reviewer recognition", href: "#" },
    ],
  };

  return (
    <footer className="bg-footer-bg text-footer-text pt-12 pb-4 mt-16 border-t">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div className="text-sm">
            <p>Online ISSN: 2542-6605</p>
            <p>Print ISSN: 2543-1536</p>
          </div>
          <div className="col-span-1 lg:col-span-3">
            <p className="text-sm">Copyright © 2025 Elsevier B.V. All rights are reserved, including those for text and data mining, AI training, and similar technologies.</p>
          </div>
        </div>
        
        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 border-t border-gray-300">
          <FooterLinkColumn title="For authors" links={footerLinks.authors} />
          <FooterLinkColumn title="For editors" links={footerLinks.editors} />
          <FooterLinkColumn title="For reviewers" links={footerLinks.reviewers} />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img src="https://i.ibb.co/2ZkL5V0/elsevier-logo-footer.png" alt="Elsevier Logo" className="h-6" />
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                <a href="#" className="hover:underline">About ScienceDirect</a>
                <a href="#" className="hover:underline">Remote access</a>
                <a href="#" className="hover:underline">Contact and support</a>
                <a href="#" className="hover:underline">Terms and conditions</a>
                <a href="#" className="hover:underline">Privacy policy</a>
              </div>
            </div>
            <img src="https://i.ibb.co/b2hN4P4/relx-logo.png" alt="RELX Logo" className="h-6" />
          </div>
          <div className="text-center text-xs mt-4">
            <p>Cookies are used by this site. <a href="#" className="underline">Cookie Settings</a></p>
            <p className="mt-2">All content on this site: Copyright © 2025 Elsevier B.V., its licensors, and contributors. All rights are reserved, including those for text and data mining, AI training, and similar technologies. For all open access content, the relevant licensing terms apply.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
