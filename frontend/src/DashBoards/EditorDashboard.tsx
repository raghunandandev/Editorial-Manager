// Manuscript management

import React, { useState } from 'react'
import EditorPayments from './EditorPayments'
import EditorReviewHistory from './EditorReviewHistory'

const EditorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'reviews'>('overview');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="mb-4 text-2xl font-bold">Editor Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`rounded px-4 py-2 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`rounded px-4 py-2 transition-colors ${
                activeTab === 'payments'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`rounded px-4 py-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Review History
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Welcome to the Editor Dashboard</h2>
            <p className="mt-2 text-gray-600">Select a tab above to view payment history, review history, or other editor functionalities.</p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <EditorPayments />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <EditorReviewHistory />
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorDashboard