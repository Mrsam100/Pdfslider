
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { AppSettings } from '../types';
import { NEWS_SOURCES } from '../constants';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  shopName: string;
  onShopNameChange: (n: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, onUpdate, shopName, onShopNameChange }) => {
  const toggleSource = (sourceId: string) => {
    const currentSources = settings.sources || [];
    const nextSources = currentSources.includes(sourceId)
      ? currentSources.filter(id => id !== sourceId)
      : [...currentSources, sourceId];
    onUpdate({ sources: nextSources });
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1000px] mx-auto animate-fade-in">
      <div className="text-center md:text-left mb-16">
        <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">User Options</span>
        <h1 className="text-6xl font-black text-[#4A4A4A] tracking-tighter">System Preferences</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="clay-card p-10 bg-white border-4 border-white shadow-xl">
          <h3 className="text-2xl font-black mb-8 text-[#4A4A4A]">Identity</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Your Full Name</label>
              <input 
                type="text" 
                className="w-full clay-pill-container px-8 py-5 font-black text-xl outline-none shadow-inner bg-white/60" 
                value={shopName} 
                onChange={e => onShopNameChange(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="clay-card p-10 bg-white border-4 border-white shadow-xl flex flex-col justify-between">
          <h3 className="text-2xl font-black mb-8 text-[#4A4A4A]">Experience</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block">Primary Language</label>
                <select 
                  className="w-full clay-pill-container px-6 py-4 font-black outline-none bg-white shadow-inner" 
                  value={settings.language} 
                  onChange={e => onUpdate({ language: e.target.value as any })}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-4 border-t border-dashed border-gray-100 mt-4">
              <div className="flex flex-col">
                <span className="font-black text-lg text-[#4A4A4A]">Dark Mode Rendering</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Optimized for high-contrast</span>
              </div>
              <button 
                onClick={() => onUpdate({ darkMode: !settings.darkMode })} 
                className={`w-16 h-8 rounded-full transition-all relative shadow-inner border-2 border-white ${settings.darkMode ? 'bg-[#6A4FBF]' : 'bg-gray-100'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all ${settings.darkMode ? 'right-0.5 bg-white' : 'left-0.5 bg-white'}`}></div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-2 clay-card p-10 bg-white/50 border-4 border-white shadow-xl">
           <div className="mb-8">
              <h3 className="text-2xl font-black text-[#4A4A4A] mb-2">Enabled Export Formats</h3>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Choose which slide formats are available in your library.</p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {NEWS_SOURCES.map(source => {
                const isSelected = (settings.sources || []).includes(source.id);
                return (
                  <button 
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`flex flex-col items-center p-4 rounded-[30px] border-2 transition-all relative group ${
                      isSelected ? 'bg-white border-[#6A4FBF] shadow-lg' : 'bg-white/20 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {source.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4A4A4A] truncate w-full px-2">
                      {source.name}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#2AB9A9] rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
           </div>
        </div>

        <div className="col-span-1 lg:col-span-2 clay-card p-8 bg-[#FFB673] text-white text-center shadow-xl">
           <h4 className="text-xl font-black mb-2 italic">"Everyone emails PDFs that should be slides."</h4>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">- Larry Page</p>
        </div>
      </div>
      
      <div className="mt-20 text-center opacity-40">
         <div className="w-16 h-16 rounded-[25px] bg-gray-200 mx-auto flex items-center justify-center text-3xl mb-4 grayscale">📄</div>
         <p className="text-[10px] font-black uppercase tracking-[0.4em]">PDFToSlides Engine v1.0.0 • Cloud Core</p>
      </div>
    </div>
  );
};

export default SettingsView;
