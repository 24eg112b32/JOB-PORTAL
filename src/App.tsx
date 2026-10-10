/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.replace('/frontend/index.html');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          JC
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">JobConnect Portal</h1>
        <p className="text-slate-600 mb-6 text-sm">
          Redirecting to the JobConnect full-stack web application...
        </p>
        <a
          href="/frontend/index.html"
          className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Open JobConnect Portal
        </a>
      </div>
    </div>
  );
}
