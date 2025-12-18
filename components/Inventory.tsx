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
    <div className="mx-auto p-3 p-md-5" style={{maxWidth: '1400px', animation: 'fadeIn 0.6s ease-out'}}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-5 gap-3">
        <div>
           <span className="fs-6 fw-bold text-uppercase d-block mb-2" style={{letterSpacing: '0.25em', color: '#6366F1'}}>Asset Repository</span>
           <h1 className="fs-1 fw-bolder" style={{color: '#111827'}}>Slide Library</h1>
        </div>
        <div className="position-relative w-100" style={{width: '20rem'}}>
            <input
                type="text"
                placeholder="Search archives..."
                className="w-100 fs-6 fw-medium border rounded-3"
                style={{padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: 'white', outline: 'none', transition: 'all 0.2s'}}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)'; e.currentTarget.style.borderColor = '#6366F1'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#dee2e6'; }}
            />
            <svg className="text-muted position-absolute" style={{width: '1rem', height: '1rem', left: '0.875rem', top: '0.875rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="row g-3">
          {filtered.map(s => (
              <div key={s.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="clay-card p-0 bg-white overflow-hidden" style={{transition: 'all 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>
                      <div className="position-relative overflow-hidden" style={{height: '10rem', backgroundColor: '#f8f9fa'}}>
                          <img src={s.thumbnailUrl} className="w-100 h-100" style={{objectFit: 'cover', transition: 'transform 0.7s'}} alt="Preview" onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''} />
                          <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center gap-2" style={{backgroundColor: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                               <button onClick={() => onExport(s)} className="p-2 bg-white rounded-circle shadow" style={{transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                                   <svg className="w-5 h-5" style={{width: '1.25rem', height: '1.25rem', color: '#111827'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                               </button>
                               <button onClick={() => onOp(s, 'delete')} className="p-2 bg-white rounded-circle shadow text-danger" style={{transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                                   <svg className="w-5 h-5" style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                               </button>
                          </div>
                      </div>

                      <div className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                              <h3 className="fw-bold text-truncate flex-fill pe-2" style={{color: '#111827'}}>{s.title}</h3>
                              <span className="fs-6 fw-bold bg-light text-muted px-2 py-1 rounded">{s.format}</span>
                          </div>
                          <p className="fs-6 text-secondary fw-medium mb-3">{new Date(s.timestamp).toLocaleDateString()}</p>
                          <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                              <span className="fs-6 fw-semibold text-muted">{s.pageCount} Slides</span>
                              <span className="fs-6 fw-semibold text-muted">{s.fileSize}</span>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {filtered.length === 0 && (
          <div className="text-center opacity-40" style={{paddingTop: '8rem', paddingBottom: '8rem'}}>
              <div className="fs-1 mb-3">🗄️</div>
              <p className="text-muted fw-bold">Library is empty.</p>
          </div>
      )}
    </div>
  );
};

export default Inventory;