/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { BRAND_NAME } from '../constants';
import { AppView } from '../types';

interface NavbarProps {
  onNavClick: (targetId: string) => void;
  activeView: AppView;
  shopName?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView, shopName, isLoggedIn, onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLanding = activeView === 'landing';

  const navItems = [
    { name: 'Home', id: 'landing' },
    { name: 'Studio', id: 'workbench' },
    { name: 'Library', id: 'vault' }
  ];

  const handleMobileNav = (id: string) => {
    onNavClick(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100" style={{ zIndex: 150, padding: '1rem' }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-white bg-opacity-90 border border-light shadow-sm rounded-pill mx-auto"
             style={{ maxWidth: '1400px', backdropFilter: 'blur(20px)', zIndex: 160 }}>
          <div className="container-fluid px-3 px-md-4">

            {/* Logo Section */}
            <div className="navbar-brand d-flex align-items-center gap-2 cursor-pointer"
                 onClick={() => handleMobileNav('landing')}
                 style={{ cursor: 'pointer' }}>
              <div className="d-flex align-items-center justify-content-center bg-dark text-white fw-bold rounded-3 shadow"
                   style={{ width: '40px', height: '40px', fontSize: '1.125rem' }}>
                P
              </div>
              <span className="fw-bold fs-5 text-dark">
                {BRAND_NAME}
              </span>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="navbar-toggler border-0"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="w-100 h-100" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-100 h-100" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>

            {/* Desktop Nav */}
            <div className="collapse navbar-collapse justify-content-center">
              <div className="d-flex align-items-center gap-2 bg-light bg-opacity-50 p-2 rounded-pill border border-light">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavClick(item.id)}
                    className={`btn btn-sm rounded-pill fw-semibold ${
                      activeView === item.id
                        ? 'btn-light text-dark shadow-sm'
                        : 'btn-link text-secondary text-decoration-none'
                    }`}
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1.25rem' }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Action / Profile */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              {isLoggedIn ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <span className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.05em' }}>Logged In</span>
                    <span className="d-block text-dark fw-bold" style={{ fontSize: '0.75rem' }}>{shopName}</span>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
                       style={{ width: '36px', height: '36px', fontSize: '0.75rem', background: 'linear-gradient(135deg, #4F46E5, #0F172A)' }}>
                    {shopName?.substring(0,1).toUpperCase() || "U"}
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="btn btn-primary rounded-pill fw-bold text-uppercase position-relative overflow-hidden"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '0.625rem 2rem', background: 'linear-gradient(90deg, #4F46E5, #6366F1, #4F46E5)' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Login
                  </span>
                </button>
              )}

              <button
                onClick={() => onNavClick(isLanding ? 'workbench' : 'landing')}
                className="btn btn-dark rounded-pill fw-bold shadow"
                style={{ fontSize: '0.75rem', letterSpacing: '0.05em', padding: '0.625rem 1.5rem' }}
              >
                {isLanding ? 'Open Studio' : 'Exit Studio'}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`position-fixed start-0 end-0 bg-white bg-opacity-95 rounded-4 shadow border border-light overflow-hidden transition-all ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
             style={{
               top: '80px',
               margin: '0 1rem',
               backdropFilter: 'blur(20px)',
               transform: isMobileMenuOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-1rem)',
               pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
               transition: 'all 0.3s ease'
             }}>
          <div className="p-4 d-flex flex-column gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMobileNav(item.id)}
                className={`btn w-100 text-start rounded-3 fw-bold ${
                  activeView === item.id
                    ? 'btn-light text-dark'
                    : 'btn-link text-secondary text-decoration-none'
                }`}
                style={{ fontSize: '0.875rem', padding: '1rem' }}
              >
                {item.name}
              </button>
            ))}

            <hr className="my-2" />

            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-3 px-3 py-2">
                <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
                     style={{ width: '40px', height: '40px', fontSize: '0.875rem' }}>
                  {shopName?.substring(0,1).toUpperCase()}
                </div>
                <div>
                  <span className="d-block text-dark fw-bold" style={{ fontSize: '0.875rem' }}>{shopName}</span>
                  <span className="d-block text-success fw-medium" style={{ fontSize: '0.75rem' }}>● Active Session</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { onLoginClick && onLoginClick(); setIsMobileMenuOpen(false); }}
                className="btn w-100 btn-primary rounded-3 fw-bold text-white shadow"
                style={{ fontSize: '0.875rem', padding: '1rem', background: 'linear-gradient(90deg, #4F46E5, #6366F1)' }}
              >
                Login to Workspace
              </button>
            )}

            <button
              onClick={() => handleMobileNav(isLanding ? 'workbench' : 'landing')}
              className="btn w-100 btn-dark rounded-3 fw-bold text-uppercase shadow"
              style={{ fontSize: '0.875rem', letterSpacing: '0.05em', padding: '1rem' }}
            >
              {isLanding ? 'Launch Studio' : 'Exit Studio'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
          style={{ backdropFilter: 'blur(4px)', zIndex: 140 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
