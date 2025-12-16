
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ConversionLog, ConversionJob } from '../types';

interface ConversionInsightsProps {
  sales: ConversionLog[];
  products: ConversionJob[];
}

const Reports: React.FC<ConversionInsightsProps> = ({ sales, products }) => {
  const totalPages = products.reduce((acc, p) => acc + p.pageCount, 0);
  const avgPages = products.length > 0 ? Math.round(totalPages / products.length) : 0;
  
  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-12">
          <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">System Efficiency</span>
          <h1 className="text-5xl font-black text-[#4A4A4A]">Conversion Analytics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="clay-card p-10 bg-[#6A4FBF] text-white shadow-2xl scale-105 transition-transform">
              <span className="text-[11px] font-black uppercase text-white/50 mb-3 block">Total Pages Processed</span>
              <div className="text-5xl font-black tracking-tighter">{totalPages}</div>
              <div className="mt-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Across All Jobs</div>
          </div>
          <div className="clay-card p-10 bg-white shadow-xl">
              <span className="text-[11px] font-black uppercase text-gray-300 mb-3 block">Avg Deck Size</span>
              <div className="text-5xl font-black text-[#4A4A4A] tracking-tighter">
                {avgPages}
              </div>
          </div>
          <div className="clay-card p-10 bg-[#FFD447] text-[#1c1917] shadow-xl">
              <span className="text-[11px] font-black uppercase text-black/40 mb-3 block">Storage Saved</span>
              <div className="text-5xl font-black tracking-tighter">
                1.2 GB
              </div>
          </div>
          <div className="clay-card p-10 bg-[#2AB9A9] text-white shadow-xl">
              <span className="text-[11px] font-black uppercase text-white/50 mb-3 block">Extraction Accuracy</span>
              <div className="text-5xl font-black tracking-tighter">
                99.8%
              </div>
          </div>
      </div>

      <div className="clay-card p-12 bg-white/90 border-4 border-white shadow-2xl">
          <h3 className="text-3xl font-black mb-10 text-[#4A4A4A]">Export Format Distribution</h3>
          <div className="space-y-6">
              {[
                  { name: 'PowerPoint (PPTX)', count: products.filter(p => p.format === 'PPTX').length, color: '#D04423' },
                  { name: 'Google Slides', count: products.filter(p => p.format === 'Google Slides').length, color: '#FBBC04' },
                  { name: 'Other Formats', count: products.filter(p => p.format !== 'PPTX' && p.format !== 'Google Slides').length, color: '#6A4FBF' }
              ].map(i => (
                  <div key={i.name}>
                      <div className="flex justify-between text-xs font-black uppercase mb-2 tracking-widest">
                          <span>{i.name}</span>
                          <span>{i.count} decks</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${products.length > 0 ? (i.count / products.length) * 100 : 0}%`, backgroundColor: i.color }}></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Reports;
