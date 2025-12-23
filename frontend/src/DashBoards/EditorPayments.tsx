import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const EditorPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const resp = await adminAPI.getPayments();
      if (resp.success) {
        setPayments(resp.data.payments || []);
      } else {
        console.error('Failed to load payments:', resp.message);
      }
    } catch (e) {
      console.error('Error loading payments', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold">Payments</h2>
      {payments.length === 0 ? (
        <div>No payments yet</div>
      ) : (
        <div className="space-y-3">
          {payments.map((p, idx) => (
            <div key={idx} className="rounded-lg border p-3 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{p.manuscriptTitle}</div>
                  <div className="text-sm text-gray-600">Author: {p.author} ({p.authorEmail})</div>
                  <div className="text-sm text-gray-600">Payment ID: {p.paymentId}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">₹{p.amount}</div>
                  <div className={`text-sm ${p.status === 'confirmed' || p.status === 'paid' ? 'text-green-600' : p.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                    {p.status}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{new Date(p.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorPayments;
