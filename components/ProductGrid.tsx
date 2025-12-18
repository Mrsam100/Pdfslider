/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Paper } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  papers: Paper[];
  onProductClick: (paper: Paper) => void;
  onUpvote: (id: string) => void;
  userUpvotes: string[];
  onPublisherClick: (publisher: string) => void;
  onToggleSave: (paper: Paper) => void;
  savedPaperIds: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  hideFilters?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  papers, 
  onProductClick, 
  onUpvote, 
  userUpvotes, 
  onPublisherClick,
  onToggleSave,
  savedPaperIds,
  hideFilters = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter logic
  const filteredPapers = useMemo(() => {
    let result = papers;
    
    // Simple Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.publisher.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, papers]);

  return (
    <section id="products" className="px-4 px-md-5 position-relative" style={{paddingTop: '5rem', paddingBottom: '5rem'}}>
      <div className="mx-auto" style={{maxWidth: '1400px'}}>
        
        {/* Header Area */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-5 gap-4">
          <div>
            <span className="fs-6 fw-bold text-uppercase d-block mb-2" style={{letterSpacing: '0.25em', color: '#6A4FBF'}}>The Modules</span>
            <h2 className="fs-1 fw-bolder mb-2" style={{color: '#4A4A4A'}}>
                Learning Adventures
            </h2>
            <p className="fs-5 text-muted">
                Select a module to preview the experience.
            </p>
          </div>

          {/* Search */}
          {!hideFilters && (
            <div className="position-relative w-100" style={{width: '20rem'}}>
                <input 
                    type="text" 
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-100 bg-white border rounded-3 px-3 py-2"
                    style={{color: '#4A4A4A', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.2s'}}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#999" className="position-absolute" style={{right: '1rem', top: '0.875rem', width: '1.25rem', height: '1.25rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="row g-4">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
              <div key={paper.id} className="col-12 col-md-6 col-lg-4 col-xl-4 h-100">
                  <ProductCard 
                      product={paper} 
                      onClick={onProductClick}
                      onUpvote={onUpvote}
                      isUpvoted={userUpvotes.includes(paper.id)}
                      onPublisherClick={onPublisherClick}
                      onToggleSave={onToggleSave}
                      isSaved={savedPaperIds.includes(paper.id)}
                  />
              </div>
            ))
          ) : (
            <div className="col-12 text-center" style={{padding: '5rem 0'}}>
              <p className="text-secondary fw-bold fs-5">No modules found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;