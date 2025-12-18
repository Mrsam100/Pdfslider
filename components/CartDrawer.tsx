/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Paper } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Paper[];
  onRemoveItem: (paper: Paper) => void;
  onItemClick: (paper: Paper) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onItemClick }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 end-0 bottom-0"
        style={{backgroundColor: 'rgba(106, 79, 191, 0.2)', backdropFilter: 'blur(4px)', zIndex: 10000, transition: 'opacity 0.5s', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none'}}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="position-fixed top-0 bottom-0 end-0 w-100 d-flex flex-column"
        style={{width: '450px', backgroundColor: '#F8E9DD', zIndex: 10001, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', transition: 'transform 0.5s ease-in-out', transform: isOpen ? 'translateX(0)' : 'translateX(100%)'}}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom" style={{borderColor: 'rgba(255,255,255,0.4)'}}>
           <h2 className="fs-3 fw-bolder" style={{color: '#4A4A4A'}}>Your Watchlist</h2>
           <button onClick={onClose} className="rounded-circle bg-white d-flex align-items-center justify-content-center text-muted shadow-sm" style={{width: '2.5rem', height: '2.5rem'}} onMouseEnter={(e) => e.currentTarget.style.color = '#6A4FBF'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        {/* Items List */}
        <div className="flex-fill overflow-auto p-4" style={{gap: '1rem'}}>
          {items.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center opacity-50" style={{gap: '1rem'}}>
               <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '5rem', height: '5rem'}}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ccc" style={{width: '2.5rem', height: '2.5rem'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                   </svg>
               </div>
               <p className="fw-bold text-secondary">Watchlist is empty</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => { onItemClick(item); onClose(); }}
                className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center cursor-pointer border"
                style={{transition: 'all 0.2s', borderColor: 'transparent'}}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.borderColor = '#FFB673'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                  <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold" style={{width: '2.5rem', height: '2.5rem', color: '#6A4FBF'}}>
                          {item.publisher.substring(0,1)}
                      </div>
                      <div>
                          <h4 className="fw-bold" style={{color: '#4A4A4A'}}>{item.title}</h4>
                          <span className="fs-6 text-secondary fw-semibold">{item.publisher}</span>
                      </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold" style={{color: '#4A4A4A'}}>{item.readTime}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveItem(item); }}
                        className="text-secondary"
                        style={{transition: 'color 0.2s'}}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '1.25rem', height: '1.25rem'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                         </svg>
                      </button>
                  </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-top" style={{borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.5)'}}>
           <button className="clay-button w-100 py-3 fw-bold fs-5">
               Start Trading
           </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;