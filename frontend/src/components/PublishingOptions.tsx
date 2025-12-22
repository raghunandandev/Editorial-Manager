import React from 'react';

const PublishingOptions: React.FC = () => {
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Article publishing options</h3>
      
      <div className="mb-6">
        <h4 className="font-bold text-md text-gray-800">Open Access</h4>
        <p className="text-sm text-gray-700 mt-2">
          Article Publishing Charge (APC): USD 3,020 (excluding taxes). The amount you pay may be reduced during submission if applicable.
        </p>
        <a href="#" className="text-brand-blue font-semibold text-sm mt-2 inline-block hover:underline">Review this journal's open access policy.</a>
      </div>

      <div>
        <h4 className="font-bold text-md text-gray-800">Subscription</h4>
        <p className="text-sm text-gray-700 mt-2">
          No publication fee charged to authors, and published articles are immediately available to subscribers.
        </p>
      </div>
    </div>
  );
};

export default PublishingOptions;
