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
      <div className="fixed top-0 left-0 w-full z-[150] px-4 py-4 md:py-6 pointer-events-none">
        <nav className="max-w-[1400px] mx-auto w-full flex items-center justify-between px-4 md:px-6 py-3 bg-white/90 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl md:rounded-full pointer-events-auto transition-all duration-300 relative z-[160]">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleMobileNav('landing')}>
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-[#0F172A]">
              {BRAND_NAME}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
             {navItems.map((item) => (
               <button 
                  key={item.id}
                  onClick={() => onNavClick(item.id)} 
                  className={`px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                    activeView === item.id 
                      ? 'bg-white text-[#0F172A] shadow-sm' 
                      : 'text-gray-500 hover:text-[#0F172A] hover:bg-white/50'
                  }`}
               >
                 {item.name}
               </button>
             ))}
          </div>

          {/* Desktop Action / Profile */}
          <div className="hidden md:flex items-center gap-4">
             {isLoggedIn ? (
               <div className="flex items-center gap-3">
                   <div className="text-right">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logged In</span>
                      <span className="block text-xs font-bold text-[#0F172A]">{shopName}</span>
                   </div>
                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#0F172A] text-white flex items-center justify-center text-xs font-bold shadow-md">
                      {shopName?.substring(0,1).toUpperCase() || "U"}
                   </div>
               </div>
             ) : (
               <button 
                 onClick={onLoginClick}
                 className="relative group overflow-hidden px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-wide transition-all duration-300 hover:scale-105"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4F46E5] animate-gradient-x"></div>
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity"></div>
                 <span className="relative text-white flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    Login
                 </span>
               </button>
             )}
             
             <button 
               onClick={() => onNavClick(isLanding ? 'workbench' : 'landing')}
               className="px-6 py-2.5 bg-[#0F172A] text-white text-xs font-bold tracking-wide rounded-full shadow-lg hover:shadow-xl hover:bg-black transition-all"
             >
               {isLanding ? 'Open Studio' : 'Exit Studio'}
             </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2 text-[#0F172A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`fixed inset-x-4 top-20 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top md:hidden pointer-events-auto ${isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
          <div className="p-6 flex flex-col gap-4">
            {navItems.map((item) => (
               <button 
                  key={item.id}
                  onClick={() => handleMobileNav(item.id)} 
                  className={`w-full py-4 text-left px-4 rounded-xl text-sm font-bold transition-all ${
                    activeView === item.id 
                      ? 'bg-[#F1F5F9] text-[#0F172A]' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
               >
                 {item.name}
               </button>
             ))}
             
             <div className="h-px bg-gray-100 my-2"></div>
             
             {isLoggedIn ? (
               <div className="flex items-center gap-3 px-4 py-2">
                   <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-sm font-bold">
                      {shopName?.substring(0,1).toUpperCase()}
                   </div>
                   <div>
                      <span className="block text-sm font-bold text-[#0F172A]">{shopName}</span>
                      <span className="block text-xs text-green-600 font-medium">● Active Session</span>
                   </div>
               </div>
             ) : (
               <button 
                 onClick={() => { onLoginClick && onLoginClick(); setIsMobileMenuOpen(false); }}
                 className="w-full py-4 text-left px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4F46E5] to-[#6366F1] shadow-lg"
               >
                 Login to Workspace
               </button>
             )}

            <button 
               onClick={() => handleMobileNav(isLanding ? 'workbench' : 'landing')}
               className="w-full py-4 bg-[#0F172A] text-white rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg"
             >
               {isLanding ? 'Launch Studio' : 'Exit Studio'}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[140] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;