import React, { useState } from 'react';
import { Bell, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SetUpAlerts: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [alertPreferences, setAlertPreferences] = useState({
    newIssues: true,
    articlesInPress: true,
    specialIssues: false,
    editorialNews: true,
    emailFrequency: 'weekly'
  });

  const handleSavePreferences = () => {
    alert('Alert preferences saved successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <Bell className="w-16 h-16 text-brand-blue mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Set Up Email Alerts</h1>
          <p className="text-gray-600 mb-6">
            Sign in to customize your email alerts and stay updated with the latest publications, special issues, and journal news.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 border border-brand-blue text-brand-blue rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Email Alert Preferences</h1>
          </div>
          <p className="text-gray-600 mb-8">
            Customize your email alerts to receive notifications about new content, special issues, and important announcements.
          </p>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Alerts</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertPreferences.newIssues}
                    onChange={(e) => setAlertPreferences({ ...alertPreferences, newIssues: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">New Issues</span>
                    <p className="text-sm text-gray-600">Get notified when new journal issues are published</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertPreferences.articlesInPress}
                    onChange={(e) => setAlertPreferences({ ...alertPreferences, articlesInPress: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Articles in Press</span>
                    <p className="text-sm text-gray-600">Receive alerts for newly accepted articles</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertPreferences.specialIssues}
                    onChange={(e) => setAlertPreferences({ ...alertPreferences, specialIssues: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Special Issues</span>
                    <p className="text-sm text-gray-600">Notifications about upcoming special issues and calls for papers</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertPreferences.editorialNews}
                    onChange={(e) => setAlertPreferences({ ...alertPreferences, editorialNews: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Editorial News</span>
                    <p className="text-sm text-gray-600">Stay informed about journal updates and editorial announcements</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Frequency</h2>
              <div className="space-y-3">
                {['daily', 'weekly', 'monthly'].map((frequency) => (
                  <label key={frequency} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="emailFrequency"
                      value={frequency}
                      checked={alertPreferences.emailFrequency === frequency}
                      onChange={(e) => setAlertPreferences({ ...alertPreferences, emailFrequency: e.target.value })}
                      className="w-5 h-5 text-brand-blue"
                    />
                    <span className="font-medium text-gray-900 capitalize">{frequency}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> You can modify these preferences at any time. Alerts will be sent to the email address associated with your account.
                </p>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetUpAlerts;

