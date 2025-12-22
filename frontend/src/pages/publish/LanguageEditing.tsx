import React from 'react';
import { Languages, CheckCircle, FileText, Clock, Award, Users } from 'lucide-react';

const LanguageEditing: React.FC = () => {
  const services = [
    {
      name: "Standard Language Editing",
      description: "Comprehensive editing for grammar, spelling, punctuation, and clarity",
      price: "$0.25 per word",
      turnaround: "5-7 business days",
      features: [
        "Grammar and spelling correction",
        "Punctuation and style consistency",
        "Clarity and readability improvements",
        "Formatting according to journal guidelines",
        "One round of revisions included"
      ],
      icon: FileText,
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Premium Language Editing",
      description: "Advanced editing with subject-matter expertise and enhanced support",
      price: "$0.35 per word",
      turnaround: "3-5 business days",
      features: [
        "All Standard editing features",
        "Subject-matter expert editor",
        "Technical terminology review",
        "Enhanced clarity and flow",
        "Two rounds of revisions included",
        "Priority support"
      ],
      icon: Award,
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Express Language Editing",
      description: "Fast-track editing for urgent submissions",
      price: "$0.40 per word",
      turnaround: "1-2 business days",
      features: [
        "All Premium editing features",
        "Expedited processing",
        "24-hour turnaround available",
        "Dedicated editor communication",
        "Unlimited revisions within timeframe"
      ],
      icon: Clock,
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const benefits = [
    "Improve clarity and readability of your manuscript",
    "Ensure compliance with journal style guidelines",
    "Increase chances of acceptance",
    "Professional editing by native English speakers",
    "Subject-matter expertise available",
    "Fast turnaround times"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Languages className="text-brand-blue" size={40} />
            Language Editing Services
          </h1>
          <p className="text-gray-600">
            Professional English language editing services to help you prepare your manuscript for publication
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${service.color}`}>
                  <Icon className="text-current" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{service.price}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock size={14} />
                    <span>{service.turnaround}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-brand-blue text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  Get Quote
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits of Professional Editing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Submit Your Manuscript</h3>
                <p className="text-gray-600 text-sm">Upload your manuscript and select your preferred editing service.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Expert Review</h3>
                <p className="text-gray-600 text-sm">A qualified editor reviews and edits your manuscript according to your selected service level.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Receive Edited Manuscript</h3>
                <p className="text-gray-600 text-sm">Receive your edited manuscript with tracked changes and comments within the specified timeframe.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Review and Revise</h3>
                <p className="text-gray-600 text-sm">Review the edits, accept or reject changes, and request revisions if needed (based on your service level).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Assurance */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="text-brand-blue" size={24} />
            Quality Assurance
          </h2>
          <p className="text-gray-700 mb-4">
            All our editors are native English speakers with advanced degrees and extensive experience in academic editing. 
            Many editors have subject-matter expertise in IoT, computer science, and related fields to ensure technical accuracy.
          </p>
          <p className="text-gray-700">
            <strong>Money-Back Guarantee:</strong> If you're not satisfied with the editing quality, we offer a full refund or 
            free re-editing by a different editor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageEditing;

