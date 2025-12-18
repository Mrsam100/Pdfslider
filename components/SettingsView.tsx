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
    <div className="pt-8 pb-6 px-3 mx-auto" style={{maxWidth: '1000px', animation: 'fadeIn 0.6s ease-out'}}>
      <div className="text-center text-md-start mb-5">
        <span className="clay-text-convex fs-6 fw-bolder text-uppercase mb-2" style={{letterSpacing: '0.25em', color: '#6A4FBF'}}>User Options</span>
        <h1 className="fs-1 fw-bolder" style={{color: '#4A4A4A', letterSpacing: '-0.05em'}}>System Preferences</h1>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6 clay-card p-5 bg-white border border-4 shadow">
          <h3 className="fs-3 fw-bolder mb-4" style={{color: '#4A4A4A'}}>Identity</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div>
              <label className="fs-6 fw-bolder text-uppercase text-secondary ms-3 mb-2 d-block">Your Full Name</label>
              <input
                type="text"
                className="w-100 clay-pill-container px-4 py-3 fw-bolder fs-4 outline-none shadow-sm"
                style={{backgroundColor: 'rgba(255,255,255,0.6)'}}
                value={shopName}
                onChange={e => onShopNameChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 clay-card p-5 bg-white border border-4 shadow d-flex flex-column justify-content-between">
          <h3 className="fs-3 fw-bolder mb-4" style={{color: '#4A4A4A'}}>Experience</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="row g-3">
              <div className="col-12">
                <label className="fs-6 fw-bolder text-uppercase text-secondary ms-3 mb-2 d-block">Primary Language</label>
                <select
                  className="w-100 clay-pill-container px-3 py-3 fw-bolder outline-none bg-white shadow-sm"
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

            <div className="d-flex align-items-center justify-content-between py-3 border-top border-dashed mt-3">
              <div className="d-flex flex-column">
                <span className="fw-bolder fs-5" style={{color: '#4A4A4A'}}>Dark Mode Rendering</span>
                <span className="fs-6 fw-bold text-secondary text-uppercase" style={{letterSpacing: '0.25em'}}>Optimized for high-contrast</span>
              </div>
              <button
                onClick={() => onUpdate({ darkMode: !settings.darkMode })}
                className="rounded-pill transition-all position-relative shadow-sm border border-2"
                style={{width: '64px', height: '32px', backgroundColor: settings.darkMode ? '#6A4FBF' : '#f8f9fa'}}
              >
                <div className="position-absolute top-0 w-6 h-6 rounded-pill shadow transition-all" style={{backgroundColor: 'white', transform: settings.darkMode ? 'translateX(32px)' : 'translateX(4px)'}}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 clay-card p-5 border border-4 shadow" style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
           <div className="mb-4">
              <h3 className="fs-3 fw-bolder mb-2" style={{color: '#4A4A4A'}}>Enabled Export Formats</h3>
              <p className="fs-6 fw-bold text-secondary text-uppercase" style={{letterSpacing: '0.25em', lineHeight: 1.625}}>Choose which slide formats are available in your library.</p>
           </div>

           <div className="row g-3">
              {NEWS_SOURCES.map(source => {
                const isSelected = (settings.sources || []).includes(source.id);
                return (
                  <div key={source.id} className="col-6 col-md-4 col-lg-2">
                    <button
                      onClick={() => toggleSource(source.id)}
                      className="d-flex flex-column align-items-center p-3 rounded-3 border border-2 transition-all position-relative group w-100"
                      style={{backgroundColor: isSelected ? 'white' : 'rgba(255,255,255,0.2)', borderColor: isSelected ? '#6A4FBF' : 'transparent', boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : ''}}
                      onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#dee2e6'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; } }}
                      onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; } }}
                    >
                      <div className="fs-2 mb-2 transition-transform" onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                        {source.icon}
                      </div>
                      <span className="fs-6 fw-bolder text-uppercase text-truncate w-100 px-2" style={{letterSpacing: '0.25em', color: '#4A4A4A'}}>
                        {source.name}
                      </span>
                      {isSelected && (
                        <div className="position-absolute top-0 end-0 w-6 h-6 bg-success rounded-circle d-flex align-items-center justify-content-center text-white fs-6 shadow">
                          ✓
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="col-12 col-lg-6 clay-card p-4 text-white text-center shadow" style={{backgroundColor: '#FFB673'}}>
           <h4 className="fs-4 fw-bolder mb-2 fst-italic">"Everyone emails PDFs that should be slides."</h4>
           <p className="fs-6 fw-bolder text-uppercase opacity-80" style={{letterSpacing: '0.2em'}}>- Larry Page</p>
        </div>
      </div>

      <div className="mt-5 text-center opacity-40">
         <div className="rounded-3 bg-light mx-auto d-flex align-items-center justify-content-center fs-2 mb-3 grayscale" style={{width: '64px', height: '64px'}}>📄</div>
         <p className="fs-6 fw-bolder text-uppercase" style={{letterSpacing: '0.4em'}}>PDFToSlides Engine v1.0.0 • Cloud Core</p>
      </div>
    </div>
  );
};

export default SettingsView;
