/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { ConversionJob } from '../types';

interface LibraryProps {
  products: ConversionJob[];
  onOp: (s: ConversionJob, op: 'add' | 'delete') => void;
  onExport: (job: ConversionJob) => void;
  categories: string[];
}

const Inventory: React.FC<LibraryProps> = ({ products, onOp, onExport }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter(s => {
      return s.title.toLowerCase().includes(search.toLowerCase()) || 
             s.originalFileName.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
           <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest mb-2 block">Asset Repository</span>
           <h1 className="text-4xl font-black text-[#111827]">Slide Library</h1>
        </div>
        <div className="relative w-full md:w-80">
            <input 
                type="text" 
                placeholder="Search archives..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(s => (
              <div key={s.id} className="clay-card p-0 bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                      <img src={s.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <button onClick={() => onExport(s)} className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                               <svg className="w-5 h-5 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                           </button>
                           <button onClick={() => onOp(s, 'delete')} className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform text-red-500">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                           </button>
                      </div>
                  </div>
                  
                  <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-[#111827] truncate flex-1 pr-2">{s.title}</h3>
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{s.format}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-4">{new Date(s.timestamp).toLocaleDateString()}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <span className="text-xs font-semibold text-gray-500">{s.pageCount} Slides</span>
                          <span className="text-xs font-semibold text-gray-500">{s.fileSize}</span>
                      </div>
                  </div>
              </div>
          ))}
      </div>
      
      {filtered.length === 0 && (
          <div className="text-center py-32 opacity-40">
              <div className="text-4xl mb-4">🗄️</div>
              <p className="text-gray-500 font-bold">Library is empty.</p>
          </div>
      )}
    </div>
  );
};

export default Inventory;