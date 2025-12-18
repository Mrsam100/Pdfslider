
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { NewsLog, NewsArticle } from '../types';

interface ActivityHistoryProps {
  customers: NewsArticle[];
  sales: NewsLog[];
}

// Repurposed component to show news discovery and processing logs
export default function Customers({ customers, sales }: ActivityHistoryProps) {
  return (
    <div className="py-5 px-3 mx-auto animate-fade-in-up" style={{ paddingTop: '8rem', maxWidth: '1200px' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-4 text-center text-md-start">
        <div>
            <span className="clay-text-convex fw-black text-uppercase d-block mb-2" style={{ fontSize: '0.625rem', color: '#2AB9A9', letterSpacing: '0.1em' }}>Engagement Stream</span>
            <h1 className="display-4 fw-black text-dark">Activity Logs</h1>
        </div>
      </div>

      <div className="row g-4">
          <div className="col-12 col-lg-8">
              <h3 className="h5 fw-black text-dark mb-4">Recent News Events</h3>
              {sales.length === 0 ? (
                  <div className="clay-card p-5 text-center fw-black fst-italic text-secondary" style={{ opacity: 0.3 }}>Waiting for news triggers...</div>
              ) : (
                sales.map(log => (
                    <div key={log.id} className="clay-card p-4 bg-white d-flex align-items-center justify-content-between border border-2 border-white shadow mb-3"
                         style={{ transition: 'border-color 0.3s' }}
                         onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(42, 185, 169, 0.3)'}
                         onMouseLeave={(e) => e.currentTarget.style.borderColor = 'white'}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="rounded-3 d-flex align-items-center justify-content-center text-white fw-black shadow"
                                 style={{ width: '3rem', height: '3rem', backgroundColor: '#6A4FBF', fontSize: '0.75rem' }}>
                                📡
                            </div>
                            <div>
                                <div className="fw-black text-dark" style={{ fontSize: '0.875rem' }}>
                                    {log.status === 'summarized' ? 'Neural Synthesis' : 'Feed Sync'} on "{log.articleTitle}"
                                </div>
                                <div className="fw-bold text-secondary text-uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}>
                                  {new Date(log.timestamp).toLocaleTimeString()} • Signal Identified
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                            <span className={`px-3 py-1 rounded-pill fw-black text-uppercase ${log.status === 'summarized' ? 'bg-success bg-opacity-10 text-success' : 'bg-info bg-opacity-10 text-info'}`}
                                  style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}>
                                {log.status === 'summarized' ? 'Signal Confirmed' : 'Processing'}
                            </span>
                        </div>
                    </div>
                ))
              )}
          </div>

          <div className="col-12 col-lg-4">
              <div className="clay-card p-5 text-white shadow mb-4" style={{ backgroundColor: '#FFB673' }}>
                  <h4 className="h5 fw-black mb-3">Focus Tip</h4>
                  <p className="small fw-bold fst-italic lh-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    "Larry: Dedication to the core mission means saying no to a thousand things. Our engine deduplicates the noise so you can focus on the signal."
                  </p>
              </div>
              <div className="clay-card p-5 bg-white border border-4 border-white shadow">
                  <h4 className="h5 fw-black text-dark mb-4">Engine Health</h4>
                  <div className="d-flex flex-column gap-3">
                      {['RSS Fetch Engine', 'Neural Deduplicator', 'Summary Generator', 'Sentiment Analyzer'].map(p => (
                          <div key={p} className="d-flex align-items-center justify-content-between">
                              <span className="small fw-bold text-secondary">{p}</span>
                              <div className="rounded-circle bg-success" style={{ width: '0.75rem', height: '0.75rem', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }}></div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
