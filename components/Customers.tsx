
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
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div>
            <span className="clay-text-convex text-[10px] font-black text-[#2AB9A9] uppercase tracking-widest mb-3">Engagement Stream</span>
            <h1 className="text-5xl font-black text-[#4A4A4A]">Activity Logs</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-[#4A4A4A] mb-8">Recent News Events</h3>
              {sales.length === 0 ? (
                  <div className="clay-card p-20 text-center opacity-30 font-black italic text-gray-400">Waiting for news triggers...</div>
              ) : (
                sales.map(log => (
                    <div key={log.id} className="clay-card p-6 bg-white flex items-center justify-between border-2 border-white hover:border-[#2AB9A9]/30 transition-all shadow-lg">
                        <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xs bg-[#6A4FBF] shadow-md`}>
                                📡
                            </div>
                            <div>
                                <div className="font-black text-[#4A4A4A] text-sm md:text-base">
                                    {log.status === 'summarized' ? 'Neural Synthesis' : 'Feed Sync'} on "{log.articleTitle}"
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()} • Signal Identified</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${log.status === 'summarized' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                {log.status === 'summarized' ? 'Signal Confirmed' : 'Processing'}
                            </span>
                        </div>
                    </div>
                ))
              )}
          </div>

          <div className="space-y-8">
              <div className="clay-card p-10 bg-[#FFB673] text-white shadow-2xl">
                  <h4 className="text-xl font-black mb-4">Focus Tip</h4>
                  <p className="text-white/80 text-sm font-bold leading-relaxed italic">
                    "Larry: Dedication to the core mission means saying no to a thousand things. Our engine deduplicates the noise so you can focus on the signal."
                  </p>
              </div>
              <div className="clay-card p-10 bg-white border-4 border-white shadow-xl">
                  <h4 className="text-xl font-black text-[#4A4A4A] mb-6">Engine Health</h4>
                  <div className="space-y-4">
                      {['RSS Fetch Engine', 'Neural Deduplicator', 'Summary Generator', 'Sentiment Analyzer'].map(p => (
                          <div key={p} className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-500">{p}</span>
                              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
