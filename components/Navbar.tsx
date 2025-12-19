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
        <nav className="navbar navbar-expand-lg navbar-light border-bottom mx-auto"
             style={{ maxWidth: '1400px', zIndex: 160, borderColor: '#e0e0e0 !important', backgroundColor: 'transparent' }}>
          <div className="container-fluid px-3 px-md-4">

            {/* Logo Section */}
            <div className="navbar-brand d-flex align-items-center gap-2 cursor-pointer"
                 onClick={() => handleMobileNav('landing')}
                 style={{ cursor: 'pointer' }}>
              <div className="d-flex align-items-center justify-content-center bg-dark text-white fw-black"
                   style={{ width: '40px', height: '40px', fontSize: '1.125rem' }}>
                P
              </div>
              <span className="fw-bold fs-5 text-dark" style={{ letterSpacing: '0.1em' }}>
                PDFSLIDER
              </span>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="navbar-toggler border-0 d-lg-none"
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
              <div className="d-flex align-items-center gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavClick(item.id)}
                    className={`btn btn-sm fw-bold text-uppercase ${
                      activeView === item.id
                        ? 'text-dark border-bottom border-2 border-dark'
                        : 'text-dark'
                    }`}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 1rem',
                      letterSpacing: '0.1em',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: 0,
                      opacity: activeView === item.id ? 1 : 0.6
                    }}
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
                    <span className="d-block text-dark fw-bold text-uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.1em', opacity: 0.6 }}>Logged In</span>
                    <span className="d-block text-dark fw-bold" style={{ fontSize: '0.75rem' }}>{shopName}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-center text-white fw-bold bg-dark"
                       style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                    {shopName?.substring(0,1).toUpperCase() || "U"}
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="btn border border-dark text-dark fw-bold text-uppercase"
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    padding: '0.625rem 2rem',
                    backgroundColor: 'transparent',
                    borderRadius: 0
                  }}
                >
                  LOGIN
                </button>
              )}

              <button
                onClick={() => onNavClick(isLanding ? 'workbench' : 'landing')}
                className="btn bg-dark text-white fw-bold text-uppercase"
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  padding: '0.625rem 1.5rem',
                  borderRadius: 0
                }}
              >
                {isLanding ? 'OPEN STUDIO' : 'EXIT STUDIO'}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`position-fixed start-0 end-0 bg-white border-top border-bottom overflow-hidden transition-all d-lg-none ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
             style={{
               top: '60px',
               margin: '0 0.5rem',
               borderColor: '#e0e0e0 !important',
               transform: isMobileMenuOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-1rem)',
               pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
               transition: 'all 0.3s ease',
               maxHeight: 'calc(100vh - 80px)',
               overflowY: 'auto'
             }}>
          <div className="p-4 d-flex flex-column gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMobileNav(item.id)}
                className={`btn w-100 text-start fw-bold text-uppercase ${
                  activeView === item.id
                    ? 'bg-dark text-white'
                    : 'border border-dark text-dark'
                }`}
                style={{
                  fontSize: '0.875rem',
                  padding: '1rem',
                  letterSpacing: '0.1em',
                  borderRadius: 0,
                  backgroundColor: activeView === item.id ? '#000000' : 'transparent'
                }}
              >
                {item.name}
              </button>
            ))}

            <div className="border-top my-2" style={{ borderColor: '#e0e0e0 !important' }} />

            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-3 px-3 py-2">
                <div className="bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
                     style={{ width: '40px', height: '40px', fontSize: '0.875rem' }}>
                  {shopName?.substring(0,1).toUpperCase()}
                </div>
                <div>
                  <span className="d-block text-dark fw-bold" style={{ fontSize: '0.875rem' }}>{shopName}</span>
                  <span className="d-block text-dark fw-medium" style={{ fontSize: '0.75rem', opacity: 0.6 }}>ACTIVE SESSION</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { onLoginClick && onLoginClick(); setIsMobileMenuOpen(false); }}
                className="btn w-100 border border-dark text-dark fw-bold text-uppercase"
                style={{
                  fontSize: '0.875rem',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  letterSpacing: '0.1em',
                  borderRadius: 0
                }}
              >
                LOGIN
              </button>
            )}

            <button
              onClick={() => handleMobileNav(isLanding ? 'workbench' : 'landing')}
              className="btn w-100 bg-dark text-white fw-bold text-uppercase"
              style={{
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                padding: '1rem',
                borderRadius: 0
              }}
            >
              {isLanding ? 'LAUNCH STUDIO' : 'EXIT STUDIO'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)', zIndex: 140 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
