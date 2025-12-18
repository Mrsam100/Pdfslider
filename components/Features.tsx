/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const Features: React.FC = () => {
  return (
    <section style={{ backgroundColor: '#EBE7DE' }}>
      {/* Feature Block 1 */}
      <div className="row g-0" style={{ minHeight: '80vh' }}>
        <div className="col-12 col-lg-6 order-2 order-lg-1 position-relative overflow-hidden" style={{ height: '500px' }}>
           <img
             src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200"
             alt="Natural Stone Texture"
             className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
             style={{ transition: 'transform 1.5s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
           />
        </div>
        <div className="col-12 col-lg-6 order-1 order-lg-2 d-flex flex-column justify-content-center p-5 p-lg-6" style={{ backgroundColor: '#EBE7DE' }}>
           <span className="fw-bold text-uppercase text-secondary mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#A8A29E' }}>Our Philosophy</span>
           <h3 className="display-5 mb-4" style={{ fontFamily: 'serif', color: '#2C2A26', lineHeight: 1.2 }}>
             Materials that age <br/> with grace.
           </h3>
           <p className="fs-5 fw-light mb-5" style={{ color: '#5D5A53', lineHeight: 1.6, maxWidth: '28rem' }}>
             We reject the disposable. Every Aura product is crafted from sandstone, unpolished aluminum, and organic fabrics that develop a unique patina over time.
           </p>
           <a href="#" className="text-decoration-underline fw-medium text-uppercase text-dark" style={{ fontSize: '0.875rem', letterSpacing: '0.1em', textUnderlineOffset: '8px' }}>Read about our materials</a>
        </div>
      </div>

      {/* Feature Block 2 */}
      <div className="row g-0" style={{ minHeight: '80vh' }}>
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center p-5 p-lg-6 bg-dark" style={{ backgroundColor: '#2C2A26', color: '#F5F2EB' }}>
           <span className="fw-bold text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#A8A29E' }}>The Ecosystem</span>
           <h3 className="display-5 mb-4" style={{ fontFamily: 'serif', color: '#F5F2EB', lineHeight: 1.2 }}>
             Silence by default.
           </h3>
           <p className="fs-5 fw-light mb-5" style={{ color: '#A8A29E', lineHeight: 1.6, maxWidth: '28rem' }}>
             Our devices respect your attention. No blinking lights, no intrusive notifications. Just calm utility when you need it, and a beautiful object when you don't.
           </p>
        </div>
        <div className="col-12 col-lg-6 position-relative overflow-hidden" style={{ height: '500px' }}>
           <img
             src="https://images.pexels.com/photos/6801917/pexels-photo-6801917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
             alt="Woman sitting on wooden floor reading"
             className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
             style={{ transition: 'transform 1.5s ease', filter: 'brightness(0.9)' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
           />
        </div>
      </div>
    </section>
  );
};

export default Features;
