/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

const Earn: React.FC = () => {
  const leaders = [
    { asset: "Logic Master", apy: "Level 12", tvl: "4,500 XP", color: "#627EEA", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '2rem', height: '2rem'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
    ) },
    { asset: "Safety Hero", apy: "Level 10", tvl: "3,200 XP", color: "#2775CA", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '2rem', height: '2rem'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) },
    { asset: "Prompt Pro", apy: "Level 8", tvl: "2,800 XP", color: "#14F195", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '2rem', height: '2rem'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
    ) },
    { asset: "Data Whiz", apy: "Level 15", tvl: "6,000 XP", color: "#E6007A", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '2rem', height: '2rem'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
    ) },
  ];

  return (
    <div className="min-vh-100 px-4 mx-auto" style={{paddingTop: '5rem', paddingBottom: '5rem', maxWidth: '1200px', animation: 'fadeInUp 0.6s ease-out'}}>
      <div className="text-center mb-5">
        <h1 className="fs-1 fs-md-2 fw-bolder mb-3" style={{color: '#4A4A4A'}}>Class Leaderboard</h1>
        <p className="fs-5 text-muted">Track your progress and earn badges as you master AI literacy.</p>
      </div>

      <div className="row g-4">
        {leaders.map((pool, idx) => (
          <div key={idx} className="col-12 col-md-6 col-lg-3">
            <div className="clay-card p-3 d-flex flex-column align-items-center cursor-pointer" style={{transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
              <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fs-2 fw-bold shadow-sm mb-3"
                  style={{width: '4rem', height: '4rem', backgroundColor: pool.color}}
              >
                  {pool.icon}
              </div>
              <h3 className="fs-4 fw-bold mb-1" style={{color: '#4A4A4A'}}>{pool.asset}</h3>
              <span className="fs-6 text-secondary fw-bold text-uppercase mb-3" style={{letterSpacing: '0.25em'}}>Achievement</span>

              <div className="w-100 rounded-3 p-3 mb-3" style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fs-6 text-muted">Rank</span>
                      <span className="fs-5 fw-bold" style={{color: '#2AB9A9'}}>{pool.apy}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-6 text-muted">Total XP</span>
                      <span className="fs-6 fw-bold" style={{color: '#4A4A4A'}}>{pool.tvl}</span>
                  </div>
              </div>

              <button className="clay-button w-100 py-2 fs-6" style={{backgroundColor: '#F8E9DD', color: '#4A4A4A'}}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earn;