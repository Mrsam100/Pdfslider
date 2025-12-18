/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface InfoPageProps {
  pageId: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ pageId }) => {
  const contentMap: Record<string, { title: string, content: string }> = {
    help: { title: "Help Center", content: "How can we assist you today? Browse our FAQs or contact support." },
    api: { title: "API Documentation", content: "Build the future of finance with ClayCoin API. Powerful, reliable, and secure." },
    fees: { title: "Fee Schedule", content: "Transparent pricing. No hidden costs. Trading fees start at 0.1%." },
    security: { title: "Security", content: "Your assets are protected by industry-leading encryption and cold storage protocols." },
    privacy: { title: "Privacy Policy", content: "We value your privacy. We do not sell your data to third parties." },
    terms: { title: "Terms of Service", content: "By using ClayCoin, you agree to our terms of service." },
  };

  const data = contentMap[pageId] || { title: "Page Not Found", content: "The requested page does not exist." };

  return (
    <div className="min-vh-100 px-4 mx-auto text-center" style={{paddingTop: '8rem', paddingBottom: '8rem', maxWidth: '800px', animation: 'fadeInUp 0.6s ease-out'}}>
       <div className="clay-card p-5" style={{background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)'}}>
           <h1 className="fs-1 fw-bolder mb-4" style={{color: '#4A4A4A'}}>{data.title}</h1>
           <div className="mx-auto mb-4 rounded-pill" style={{width: '4rem', height: '0.25rem', backgroundColor: '#FFB673'}}></div>
           <p className="fs-5 text-muted" style={{lineHeight: 1.625}}>
               {data.content}
           </p>
           <div className="mt-5 p-3 rounded-3 fs-6 text-muted" style={{backgroundColor: '#F8E9DD'}}>
               This is a demo page for the ClayCoin application interface.
           </div>
       </div>
    </div>
  );
};

export default InfoPage;
