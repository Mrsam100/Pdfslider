/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Exchange from './components/Exchange';
import POS from './components/POS'; 
import Inventory from './components/Inventory'; 
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { AppView, ConversionJob, PPTVariant } from './types';
import { INITIAL_FEED, NEWS_SOURCES } from './constants';
import { analyzePdfForSlides } from './services/geminiService';
import { extractTextFromPdf } from './services/pdfService';
import { extractTextFromDocx } from './services/docxService';
import { generatePptx } from './services/pptxService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isAnimating, setIsAnimating] = useState(false); // Controls view transition
  const [userName, setUserName] = useState<string>(localStorage.getItem('asn_user_name') || '');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('asn_user_name'));
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Conversion State
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStage, setConversionStage] = useState('');
  const [conversionProgress, setConversionProgress] = useState(0);

  // Data State
  const [feed, setFeed] = useState<ConversionJob[]>([]); // Studio Feed (Current Session)
  const [archive, setArchive] = useState<ConversionJob[]>([]); // Library (All History)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const savedArchive = localStorage.getItem('asn_archive');
    
    // feed is reset on reload to emphasize "Session" vs "Library"
    if (savedArchive) setArchive(JSON.parse(savedArchive));
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (name: string, email: string) => {
    // Called after username entry in modal
    setUserName(name);
    setIsLoggedIn(true);
    localStorage.setItem('asn_user_name', name);
    setShowLogin(false);
  };

  const handleArchiveOp = (job: ConversionJob, op: 'add' | 'delete') => {
    let next;
    if (op === 'add') {
      if (archive.find(a => a.id === job.id)) return;
      next = [job, ...archive];
    }
    else next = archive.filter(a => a.id !== job.id);
    
    setArchive(next);
    localStorage.setItem('asn_archive', JSON.stringify(next));
  };

  const attemptConversion = (file: File) => {
    if (!isLoggedIn) {
        setShowLogin(true);
        return;
    }
    startConversion(file);
  }

  const startConversion = async (file: File) => {
    setIsConverting(true);
    setConversionProgress(5);
    setConversionStage(`Authenticating Blueprint...`);
    
    try {
      // Step 1: Parsing
      setConversionProgress(20);
      setConversionStage('Extracting vector data & text layer...');
      
      let extractedText = "";
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType === 'pdf') extractedText = await extractTextFromPdf(file);
      else if (fileType === 'docx') extractedText = await extractTextFromDocx(file);
      else throw new Error("Format Incompatible. Engine requires PDF or DOCX.");

      // Step 2: AI Analysis
      setConversionProgress(40);
      setConversionStage('Gemini 2.5 Pro: Generating 3 strategic angles...');

      const aiResponse = await analyzePdfForSlides(extractedText);
      
      if (!aiResponse || !aiResponse.executiveDeck || !aiResponse.creativeDeck) {
          throw new Error("Synthesis Interrupted. AI could not generate variants.");
      }

      // Step 3: Formatting
      setConversionProgress(80);
      setConversionStage('Rendering visuals and data structures...');
      
      await new Promise(r => setTimeout(r, 800)); // Smooth transition
      setConversionProgress(100);
      setConversionStage('Finalizing 3 unique design variants...');

      // Create 3 Variants with DISTINCT Content
      const variants: PPTVariant[] = [
        { 
            id: 'v1', 
            name: 'Executive Strategy', 
            theme: 'executive', 
            color: '#0F172A',
            slides: aiResponse.executiveDeck 
        },
        { 
            id: 'v2', 
            name: 'Creative Vision', 
            theme: 'creative', 
            color: '#4C1D95',
            slides: aiResponse.creativeDeck 
        },
        { 
            id: 'v3', 
            name: 'Technical Data', 
            theme: 'minimal', 
            color: '#000000',
            slides: aiResponse.technicalDeck 
        }
      ];

      const newJob: ConversionJob = {
        id: `job-${Date.now()}`,
        title: variants[0].slides[0]?.title || file.name.replace(/\.[^/.]+$/, ""),
        originalFileName: file.name,
        pageCount: variants[0].slides.length, // Display executive count as default
        status: 'Completed',
        timestamp: Date.now(),
        thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
        previewSlides: variants[0].slides.map((s: any) => s.title),
        format: 'PPTX',
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        source: fileType === 'pdf' ? 'PDF Engine' : 'DOCX Parser',
        variants: variants
      };

      // Add to Studio Feed (Current Session)
      setFeed(prev => [newJob, ...prev]);
      
      // Add to Library (Archive)
      handleArchiveOp(newJob, 'add');
      
      setTimeout(() => {
        setIsConverting(false);
        handleNav('workbench'); // Go to Studio
      }, 500);
      
    } catch (error: any) {
      console.error("Conversion failed:", error);
      alert(error.message || "Strategic synthesis encountered a neural fault.");
      setIsConverting(false);
    }
  };

  const handleExport = async (job: ConversionJob, variantId?: string) => {
    try {
      // Find the specific variant content
      const selectedVariant = job.variants?.find(v => v.id === variantId) || job.variants?.[0];
      
      if (!selectedVariant || !selectedVariant.slides) {
          throw new Error("Variant data missing.");
      }

      await generatePptx(
          selectedVariant.slides, 
          job.originalFileName, 
          selectedVariant.theme
      );
    } catch (err) {
      console.error(err);
      alert("Strategic Export Fault. Please retry.");
    }
  };

  const handleNav = (target: string) => {
    // Require login for Studio (workbench) or Library (vault)
    if ((target === 'workbench' || target === 'vault') && !isLoggedIn) {
      setShowLogin(true);
      return;
    }
    
    if (['landing', 'workbench', 'vault'].includes(target)) {
      if (target !== view) {
          setIsAnimating(true);
          setTimeout(() => {
             setView(target as AppView);
             setIsAnimating(false);
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
      }
    } else {
        const el = document.getElementById(target);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
          <div className="w-16 h-16 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="font-bold text-gray-400 text-sm tracking-widest uppercase animate-pulse">Initializing Engine</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#4F46E5]/20 font-inter">
      <Navbar 
        onNavClick={handleNav} 
        activeView={view} 
        shopName={userName} 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
      />
      
      {/* Login Modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {/* Progress Overlay */}
      {isConverting && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-fade-in">
           <div className="max-w-md w-full p-8 text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      fill="none" stroke="#0F172A" strokeWidth="8" 
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * conversionProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#0F172A]">
                    {conversionProgress}%
                  </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#0F172A]">Synthesizing Presentation</h2>
              <p className="text-gray-500 text-sm font-medium animate-pulse">{conversionStage}</p>
           </div>
        </div>
      )}

      <main className={`flex-grow pt-24 min-h-screen transition-opacity duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {view === 'landing' && (
           <div className="view-enter-active">
              <Hero 
                onStart={() => handleNav('workbench')} 
                onFileSelect={attemptConversion}
              />
              <Exchange />
           </div>
        )}

        {view === 'workbench' && (
            <div className="view-enter-active">
              <POS 
                feed={feed}
                onArchive={(job) => handleArchiveOp(job, 'add')}
                onExport={handleExport}
                onFileSelect={attemptConversion}
                shopName={userName} 
              />
            </div>
        )}

        {view === 'vault' && (
            <div className="view-enter-active">
              <Inventory 
                products={archive} 
                onOp={handleArchiveOp} 
                onExport={handleExport}
                categories={NEWS_SOURCES.map(s => s.name)}
              />
            </div>
        )}
      </main>

      {view === 'landing' && <Footer onLinkClick={(e, id) => { e.preventDefault(); handleNav(id); }} />}
    </div>
  );
};

export default App;