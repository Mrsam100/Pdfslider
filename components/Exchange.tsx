/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Exchange: React.FC = () => {
  return (
    <div className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6366F1] mb-2 block">The Pipeline</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">Intelligent Reconstruction</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                  { n: "01", t: "Ingest", d: "Deep XML parsing of source PDF/DOCX structure." },
                  { n: "02", t: "Deconstruct", d: "Identification of headers, figures, and key text blocks." },
                  { n: "03", t: "Synthesize", d: "Gemini 2.5 Pro generates strategic slide narratives." },
                  { n: "04", t: "Render", d: "Vector-perfect export to native PowerPoint formats." }
              ].map(step => (
                  <div key={step.n} className="clay-card p-8 bg-white/50 border border-gray-100 hover:border-[#6366F1]/20 transition-colors">
                      <div className="text-4xl font-black text-gray-100 mb-4">{step.n}</div>
                      <h3 className="font-bold text-lg text-[#111827] mb-2">{step.t}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.d}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Exchange;