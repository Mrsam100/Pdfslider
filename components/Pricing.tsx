
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Monthly",
      price: "$19",
      period: "/month",
      features: ["Unlimited Sales", "Inventory Manager", "Customer CRM", "Email Reports"],
      color: "#FFB673"
    },
    {
      name: "Annual",
      price: "$159",
      period: "/year",
      features: ["Everything in Monthly", "2 Months Free", "Priority Support", "Custom QR Codes"],
      color: "#6A4FBF",
      popular: true
    }
  ];

  return (
    <section className="py-5 px-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
      <div className="text-center mb-5 mx-auto" style={{ maxWidth: '1000px' }}>
        <span className="clay-text-convex fw-bold text-uppercase d-block mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#6A4FBF' }}>Simple Pricing</span>
        <h2 className="display-5 fw-bolder text-dark mb-4">Pricing for Every Shop</h2>
        <p className="fs-5 text-secondary fw-medium">No hidden fees. No complicated contracts. Just simple plans.</p>
      </div>

      <div className="row g-4 mx-auto" style={{ maxWidth: '900px' }}>
        {plans.map((plan, idx) => (
          <div key={idx} className="col-12 col-md-6">
            <div className={`clay-card p-5 position-relative d-flex flex-column align-items-center ${plan.popular ? 'border border-3' : ''}`}
                 style={plan.popular ? { borderColor: '#6A4FBF' } : {}}>
               {plan.popular && (
                  <div className="position-absolute bg-primary text-white px-3 py-1 rounded-pill fw-bold text-uppercase" style={{ top: '-1rem', fontSize: '0.75rem', letterSpacing: '0.1em', backgroundColor: '#6A4FBF' }}>Most Popular</div>
               )}
               <h3 className="h4 fw-bolder text-dark mb-3">{plan.name}</h3>
               <div className="d-flex align-items-baseline gap-1 mb-4">
                  <span className="display-4 fw-bolder text-dark">{plan.price}</span>
                  <span className="text-secondary fw-medium">{plan.period}</span>
               </div>
               <ul className="list-unstyled w-100 mb-4">
                  {plan.features.map((f, i) => (
                     <li key={i} className="d-flex align-items-center gap-2 text-secondary fw-medium mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                             style={{ width: '1.25rem', height: '1.25rem', backgroundColor: '#2AB9A9', fontSize: '0.625rem' }}>✓</div>
                        {f}
                     </li>
                  ))}
               </ul>
               <button className={`btn w-100 py-3 rounded-pill fw-bolder fs-5 shadow ${plan.popular ? 'btn-primary text-white' : 'btn-light text-dark'}`}
                       style={plan.popular ? { backgroundColor: '#6A4FBF', borderColor: '#6A4FBF' } : {}}>
                  Choose {plan.name}
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4 text-secondary fw-medium">
          Start with a 14-day free trial. No credit card required.
      </div>
    </section>
  );
};

export default Pricing;
