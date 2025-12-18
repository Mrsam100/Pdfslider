/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const Wallet: React.FC = () => {
  return (
    <div className="min-vh-100 py-5 px-3 mx-auto" style={{maxWidth: '1000px', animation: 'fadeInUp 0.6s ease-out'}}>
       <div className="clay-card p-4 p-md-5 mb-5 position-relative overflow-hidden">
           {/* Background Decos */}
           <div className="position-absolute top-0 end-0 rounded-circle pointer-events-none" style={{width: '256px', height: '256px', backgroundColor: '#FFB673', opacity: 0.1, filter: 'blur(64px)'}}></div>

           <div className="position-relative z-10 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-4">
               <div>
                   <span className="fs-6 fw-bold text-muted text-uppercase d-block mb-2" style={{letterSpacing: '0.25em'}}>Knowledge Level</span>
                   <h1 className="fs-1 fs-md-2 fw-bolder mb-3" style={{color: '#4A4A4A'}}>Level 12</h1>
                   <div className="d-flex align-items-center gap-2 fw-bold" style={{color: '#2AB9A9'}}>
                       <span className="px-2 py-1 rounded-3 fs-6" style={{backgroundColor: '#e6fffa'}}>+ 450 XP (Today)</span>
                       <span className="text-secondary fs-6">Keep going!</span>
                   </div>
               </div>
               <div className="d-flex gap-3">
                   <button className="clay-button px-4 py-2" style={{backgroundColor: '#F8E9DD', color: '#4A4A4A'}}>My Badges</button>
                   <button className="px-4 py-2 rounded-pill bg-white fw-bold shadow-sm" style={{color: '#4A4A4A', transition: 'box-shadow 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>Assignments</button>
               </div>
           </div>
       </div>

       <div className="row g-4">
           <div className="col-12 col-lg-8 gap-3">
               <h3 className="fs-4 fw-bold mb-3" style={{color: '#4A4A4A'}}>Current Assignments</h3>
               {[
                   { name: "Spot the Deepfake", symbol: "Visual Literacy", amount: "Due Today", value: "500 XP", change: "In Progress", color: "#F7931A" },
                   { name: "Algorithm Logic", symbol: "Coding", amount: "Due Friday", value: "300 XP", change: "Not Started", color: "#627EEA" },
                   { name: "Data Privacy", symbol: "Safety", amount: "Completed", value: "1000 XP", change: "Done", color: "#14F195" },
               ].map((asset, i) => (
                   <div key={i} className="clay-card p-3 d-flex align-items-center justify-content-between cursor-pointer" style={{transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                       <div className="d-flex align-items-center gap-3">
                           <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-6" style={{width: '40px', height: '40px', backgroundColor: asset.color}}>
                               {asset.symbol.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                               <h4 className="fw-bold" style={{color: '#4A4A4A'}}>{asset.name}</h4>
                               <span className="fs-6 text-muted">{asset.symbol}</span>
                           </div>
                       </div>
                       <div className="text-end">
                           <div className="fw-bold" style={{color: '#4A4A4A'}}>{asset.value}</div>
                           <div className="fs-6 fw-bold" style={{color: asset.change === 'Done' ? '#2AB9A9' : '#FFB673'}}>{asset.change}</div>
                       </div>
                   </div>
               ))}
           </div>

           <div className="col-12 col-lg-4">
                <h3 className="fs-4 fw-bold mb-3" style={{color: '#4A4A4A'}}>Recent Activity</h3>
                <div className="clay-card p-3" style={{minHeight: '300px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {[1,2,3,4].map(i => (
                            <div key={i} className="d-flex justify-content-between align-items-center fs-6">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px', backgroundColor: '#F8E9DD', color: '#6A4FBF'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '16px', height: '16px'}}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v8.625" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{color: '#4A4A4A'}}>Earned Badge</div>
                                        <div className="fs-6 text-secondary">Today, 10:23 AM</div>
                                    </div>
                                </div>
                                <span className="fw-bold" style={{color: '#2AB9A9'}}>+100 XP</span>
                            </div>
                        ))}
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
};

export default Wallet;