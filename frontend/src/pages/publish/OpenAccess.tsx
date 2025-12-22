import React from 'react';
import { Lock, Unlock, DollarSign, Globe, FileText, CheckCircle } from 'lucide-react';

const OpenAccess: React.FC = () => {
  const options = [
    {
      type: "Gold Open Access",
      description: "Immediate free access to your article upon publication",
      icon: Unlock,
      features: [
        "Article freely available to all readers",
        "No subscription required",
        "Maximum visibility and impact",
        "CC BY license (Creative Commons Attribution)",
        "Can be shared and reused with attribution"
      ],
      pricing: "Article Processing Charge (APC): $2,500",
      color: "bg-green-100 text-green-800"
    },
    {
      type: "Hybrid Open Access",
      description: "Open access option for subscription articles",
      icon: Lock,
      features: [
        "Article published in subscription journal",
        "Option to make individual article open access",
        "CC BY license available",
        "Article marked as open access",
        "Available in subscription and open access versions"
      ],
      pricing: "Article Processing Charge (APC): $2,500",
      color: "bg-blue-100 text-blue-800"
    },
    {
      type: "Green Open Access",
      description: "Self-archiving option for subscription articles",
      icon: FileText,
      features: [
        "Article published in subscription journal",
        "Author can self-archive accepted manuscript",
        "12-month embargo period",
        "Can be posted on personal/institutional websites",
        "No additional charges"
      ],
      pricing: "No additional charge",
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const benefits = [
    {
      title: "Increased Visibility",
      description: "Open access articles receive significantly more downloads and citations than subscription-only articles"
    },
    {
      title: "Broader Impact",
      description: "Your research reaches a global audience without barriers, including researchers in developing countries"
    },
    {
      title: "Faster Dissemination",
      description: "Immediate access means your findings can influence research and practice more quickly"
    },
    {
      title: "Compliance",
      description: "Meet funder requirements for open access publication and data sharing"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Globe className="text-brand-blue" size={40} />
            Open Access Options
          </h1>
          <p className="text-gray-600">
            Choose the open access option that best fits your research needs and funding requirements
          </p>
        </div>

        {/* Open Access Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {options.map((option, idx) => {
            const Icon = option.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${option.color}`}>
                    <Icon className="text-current" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{option.type}</h2>
                </div>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <ul className="space-y-2 mb-4">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <DollarSign size={18} />
                    <span>{option.pricing}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Open Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="border-l-4 border-brand-blue pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Funding Support */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Funding Support</h2>
          <p className="text-gray-700 mb-4">
            Many funding agencies and institutions provide support for open access publication charges. 
            We have agreements with various institutions and funding bodies to cover or reduce APCs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Institutional Agreements</h3>
              <p className="text-sm text-gray-600">
                Check if your institution has an open access agreement with us. Many universities and research 
                institutions have prepaid or discounted APC arrangements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Funder Policies</h3>
              <p className="text-sm text-gray-600">
                We comply with major funder open access policies including those from NIH, Wellcome Trust, 
                UKRI, and Horizon Europe. Your funder may cover publication costs.
              </p>
            </div>
          </div>
          <button className="mt-4 bg-brand-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Check Funding Eligibility
          </button>
        </div>

        {/* License Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Creative Commons Licenses</h2>
          <p className="text-gray-700 mb-4">
            Open access articles are published under Creative Commons licenses, which determine how your work can be used:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-1">CC BY (Attribution)</h3>
              <p className="text-sm text-gray-600">
                Allows others to distribute, remix, adapt, and build upon your work, even commercially, 
                as long as they credit you. This is the most open license and is recommended for maximum impact.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-1">CC BY-NC-ND (Attribution-NonCommercial-NoDerivs)</h3>
              <p className="text-sm text-gray-600">
                Allows others to download and share your work with credit, but they cannot change it or use it commercially.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAccess;

