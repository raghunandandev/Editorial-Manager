// Manuscript management

import React, { useState } from 'react'
import EditorPayments from './EditorPayments'

const EditorDashboard = () => {
  const [showPayments, setShowPayments] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editor Dashboard</h1>
          <div>
            <button onClick={() => setShowPayments(prev => !prev)} className="rounded bg-indigo-600 px-4 py-2 text-white">
              {showPayments ? 'Hide Payments' : 'View Payments'}
            </button>
          </div>
        </div>

        {showPayments ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <EditorPayments />
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">Welcome to the editor dashboard.</div>
        )}
      </div>
    </div>
  )
}

export default EditorDashboard