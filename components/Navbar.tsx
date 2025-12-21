/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  onNavClick: (targetId: string) => void;
  activeView: AppView;
  shopName?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView, shopName, isLoggedIn, onLoginClick }) => {
  const isLanding = activeView === 'landing';

  const navItems = [
    { name: 'Home', id: 'landing' },
    { name: 'Studio', id: 'workbench' },
    { name: 'Library', id: 'vault' }
  ];

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100" style={{ zIndex: 150, padding: '0.5rem 1rem' }}>
        <nav className="navbar navbar-expand-lg navbar-light border-bottom mx-auto"
             style={{ maxWidth: '1400px', zIndex: 160, borderColor: '#e0e0e0 !important', backgroundColor: '#ffffff' }}>
          <div className="container-fluid px-2 px-md-4">

            {/* Logo Section */}
            <div className="navbar-brand d-flex align-items-center gap-2 cursor-pointer"
                 onClick={() => onNavClick('landing')}
                 style={{ cursor: 'pointer', marginBottom: 0 }}>
              <div className="d-flex align-items-center justify-content-center bg-dark text-white fw-black"
                   style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}>
                P
              </div>
              <span className="fw-bold text-dark d-none d-sm-inline" style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>
                PDFSLIDER
              </span>
              <span className="fw-bold text-dark d-inline d-sm-none" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>
                PDF
              </span>
            </div>


            {/* Navigation - Visible on all screen sizes */}
            <div className="d-flex justify-content-center flex-grow-1">
              <div className="d-flex align-items-center gap-2 gap-md-3">
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
                      fontSize: '0.625rem',
                      padding: '0.5rem 0.75rem',
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
      </div>
    </>
  );
};

export default Navbar;
