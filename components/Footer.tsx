/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME } from '../constants';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  return (
    <footer className="relative pt-32 pb-12 px-6 mt-0 overflow-hidden bg-[#0F172A]">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4F46E5] opacity-20 rounded-full blur-[100px]"></div>
        
        <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-white/10">
                <div className="text-center lg:text-left">
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Your Strategy. <br/>
                        <span className="text-[#4F46E5]">Automated.</span>
                    </h3>
                    <p className="text-white/60 text-lg font-medium max-w-md mx-auto lg:mx-0">
                        Access your entire history of generated presentations in the library.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                    {/* Fixed: Link navigates to 'vault' (Library) */}
                    <button onClick={(e) => onLinkClick(e, 'vault')} className="px-10 py-5 bg-white text-[#0F172A] font-black uppercase tracking-widest rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 text-xs">
                        Open Library Feed
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-white/40">
                <div className="text-[11px] font-bold uppercase tracking-widest">
                    © 2025 PDFToSlides Pro Enterprise
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors text-sm font-bold">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors text-sm font-bold">Terms</a>
                    <a href="#" className="hover:text-white transition-colors text-sm font-bold">Contact</a>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;