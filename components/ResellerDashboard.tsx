/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ResellerProps {
  currency: string;
}

const ResellerDashboard: React.FC<ResellerProps> = ({ currency }) => {
  const handleCopyLink = () => {
    const resellerId = localStorage.getItem('ss_reseller_id') || Math.random().toString(36).substr(2, 6).toUpperCase();
    if (!localStorage.getItem('ss_reseller_id')) {
      localStorage.setItem('ss_reseller_id', resellerId);
    }

    const link = `https://shopsmart.app/join?ref=${resellerId}`;
    navigator.clipboard.writeText(link).then(() => {
        alert("Referral link copied! " + link);
    }).catch(err => {
        console.error('Could not copy link: ', err);
        alert("Referral code: " + resellerId);
    });
  };

  return (
    <div className="pt-8 pb-6 px-3 mx-auto" style={{maxWidth: '1200px', animation: 'fadeIn 0.6s ease-out'}}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-4 text-center text-md-start">
        <div>
            <span className="clay-text-convex fs-6 fw-bolder text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#6A4FBF'}}>Community Hub</span>
            <h1 className="fs-1 fw-bolder" style={{color: '#4A4A4A'}}>Partner Center</h1>
        </div>
        <div className="d-flex gap-3">
            <button onClick={handleCopyLink} className="px-5 py-3 clay-button-primary text-white fw-bolder text-uppercase fs-6 rounded-pill shadow hover:scale-105 active:scale-95 transition-all" style={{letterSpacing: '0.25em'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}>Copy Invite Link</button>
            <button className="px-5 py-3 bg-white fw-bolder text-uppercase fs-6 rounded-pill shadow hover:shadow transition-all" style={{color: '#6A4FBF', letterSpacing: '0.25em'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>Payout Config</button>
        </div>
      </div>

      <div className="row g-5 mb-5">
          <div className="col-12 col-md-4 clay-card p-5 text-white shadow" style={{backgroundColor: '#6A4FBF', transform: 'scale(1.05)'}}>
              <span className="fs-6 fw-bolder text-uppercase d-block mb-2 opacity-50" style={{letterSpacing: '0.25em'}}>Total Commissions</span>
              <div className="fs-1 fw-bolder" style={{letterSpacing: '-0.05em'}}>{currency}1,245.00</div>
              <div className="mt-3 d-flex align-items-center gap-3">
                  <span className="bg-white px-3 py-1 rounded-3 fs-6 fw-bolder opacity-20">Diamond Status</span>
              </div>
          </div>
          <div className="col-12 col-md-4 clay-card p-5 bg-white shadow">
              <span className="fs-6 fw-bolder text-uppercase text-light d-block mb-2" style={{letterSpacing: '0.25em'}}>Active Referrals</span>
              <div className="fs-1 fw-bolder" style={{color: '#4A4A4A', letterSpacing: '-0.05em'}}>18</div>
              <div className="mt-3 fs-6 fw-bolder text-uppercase d-flex align-items-center gap-2" style={{color: '#2AB9A9', letterSpacing: '0.25em'}}>
                <span className="rounded-circle animate-pulse" style={{width: '8px', height: '8px', backgroundColor: '#2AB9A9'}}></span>
                Onboarded Shops
              </div>
          </div>
          <div className="col-12 col-md-4 clay-card p-5 text-white shadow" style={{backgroundColor: '#FFB673'}}>
              <span className="fs-6 fw-bolder text-uppercase d-block mb-2 opacity-50" style={{letterSpacing: '0.25em'}}>Earn Rate</span>
              <div className="fs-1 fw-bolder" style={{letterSpacing: '-0.05em'}}>20%</div>
              <div className="mt-3 fs-6 fw-bolder text-uppercase opacity-60" style={{letterSpacing: '0.25em'}}>Growth Tier</div>
          </div>
      </div>

      <div className="clay-card p-5 border border-4 shadow overflow-hidden" style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
          <h3 className="fs-2 fw-bolder mb-5" style={{color: '#4A4A4A'}}>Merchant Network</h3>
          <div className="overflow-x-auto">
              <table className="w-100 text-start" style={{minWidth: '800px'}}>
                  <thead>
                      <tr className="fs-6 fw-bolder text-uppercase text-secondary border-bottom border-4" style={{letterSpacing: '0.25em'}}>
                          <th className="pb-4 px-3">Merchant Shop</th>
                          <th className="pb-4 px-3">Joined Date</th>
                          <th className="pb-4 px-3">Plan Status</th>
                          <th className="pb-4 px-3 text-end">My Share (Total)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {[
                          { name: "Apex Grocery", type: "Grocery", date: "2024-11-12", status: "Active", earned: 245.00, icon: "🛒" },
                          { name: "Elite Salon", type: "Salon", date: "2025-01-02", status: "Active", earned: 112.50, icon: "✂️" },
                          { name: "Bridge Meds", type: "Pharmacy", date: "2024-12-15", status: "Expired", earned: 450.00, icon: "💊" },
                          { name: "Fresh Produce", type: "Vendor", date: "2025-02-10", status: "Trial", earned: 0.00, icon: "🍎" },
                      ].map((m, i) => (
                          <tr key={i} className="border-bottom border-2 group cursor-pointer transition-all" style={{borderColor: '#f8f9fa'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 233, 221, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                              <td className="py-4 px-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-3 bg-white shadow-sm d-flex align-items-center justify-content-center fs-4" style={{width: '48px', height: '48px'}}>{m.icon}</div>
                                    <div>
                                        <div className="fw-bolder fs-4 transition-colors" style={{color: '#4A4A4A'}} onMouseEnter={(e) => e.currentTarget.style.color = '#6A4FBF'} onMouseLeave={(e) => e.currentTarget.style.color = '#4A4A4A'}>{m.name}</div>
                                        <div className="fs-6 fw-bold text-secondary text-uppercase" style={{letterSpacing: '0.25em'}}>{m.type}</div>
                                    </div>
                                </div>
                              </td>
                              <td className="py-4 px-3 fw-bold text-muted fs-6">{m.date}</td>
                              <td className="py-4 px-3">
                                  <span className={`px-3 py-2 rounded-pill fs-6 fw-bolder text-uppercase ${m.status === 'Active' ? 'bg-success-subtle text-success' : m.status === 'Trial' ? 'bg-primary-subtle text-primary' : 'bg-danger-subtle text-danger'}`} style={{letterSpacing: '0.25em'}}>
                                      {m.status}
                                  </span>
                              </td>
                              <td className="py-4 px-3 fw-bolder fs-3 text-end" style={{letterSpacing: '-0.025em'}}>{currency}{m.earned.toFixed(2)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;
