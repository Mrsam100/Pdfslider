/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Paper } from '../types';
import { getPublisherInfo } from '../constants';

interface ProductCardProps {
  product: Paper;
  onClick: (paper: Paper) => void;
  onUpvote: (id: string) => void;
  isUpvoted: boolean;
  onPublisherClick?: (publisher: string) => void;
  onToggleSave?: (paper: Paper) => void;
  isSaved?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onUpvote,
  isUpvoted,
  onPublisherClick,
  onToggleSave,
  isSaved
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isSaved) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
        onToggleSave(product);
    }
  };

  const publisherInfo = getPublisherInfo(product.publisher);

  return (
    <div
        className="clay-card clay-bevel p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
        onClick={() => onClick(product)}
        style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* 3D Depth Decoration */}
      <div
        className="position-absolute shape-decoration-embedded"
        style={{
          right: '-1.5rem',
          top: '-1.5rem',
          width: '8rem',
          height: '8rem',
          opacity: 0.6,
          color: publisherInfo.color,
          transition: 'transform 0.7s ease',
          pointerEvents: 'none'
        }}
      ></div>

      <div className="position-relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
             <div className="d-flex align-items-center gap-3">
                 <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow border border-white border-opacity-25"
                      style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: publisherInfo.color,
                        boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.2), 2px 2px 4px rgba(255,255,255,0.4)'
                      }}>
                     {publisherInfo.logo}
                 </div>
                 <div>
                     <span className="d-block fw-bold fs-6 text-dark lh-sm">{product.title}</span>
                     <span className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>{product.publisher}</span>
                 </div>
             </div>
             <button
                onClick={handleSaveClick}
                className={`clay-icon-btn ${shouldAnimate ? 'animate-pop' : ''} ${isSaved ? 'text-warning' : 'text-secondary'}`}
                style={{ width: '2.5rem', height: '2.5rem', border: 'none', background: 'transparent' }}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                 </svg>
              </button>
        </div>

        {/* 3D Image Display */}
        {product.fileUrl && (
          <div className="mb-4 clay-img-inset position-relative" style={{ height: '10rem', width: '100%', transition: 'box-shadow 0.5s ease' }}>
             <img src={product.fileUrl} alt={product.title} className="w-100 h-100 object-fit-cover" style={{ opacity: 0.9 }} />
             <div className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: 'linear-gradient(135deg, rgba(106, 79, 191, 0.1) 0%, transparent 100%)', pointerEvents: 'none' }}></div>
          </div>
        )}

        <div className="mb-3">
            {/* 3D Convex Display (Difficulty/Level) */}
            <span className="clay-text-convex mb-1">
                <span className="d-block display-6 fw-bolder text-dark" style={{ letterSpacing: '-0.02em' }}>{product.readTime}</span>
            </span>
            <span className="d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2AB9A9' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '0.75rem', height: '0.75rem' }}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                {product.upvotes} XP Reward
            </span>
        </div>

        <p className="text-secondary fw-medium mb-4" style={{ fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.abstractPreview}
        </p>

        {/* 3D Tags */}
        <div className="d-flex flex-wrap gap-2 mb-3">
             {product.aiInsights && product.aiInsights.slice(0,2).map((tag, i) => (
                 <span key={i} className="clay-tag px-3 py-1 rounded-3 fw-bold" style={{ fontSize: '0.625rem', color: '#6A4FBF' }}>
                     {tag}
                 </span>
             ))}
        </div>
      </div>

      <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 10 }}>
          <span className="text-secondary fw-bold" style={{ fontSize: '0.75rem' }}>Rec. Grade: {product.publicationDate}</span>
          <button className="btn btn-link text-decoration-none fw-bold p-0" style={{ fontSize: '0.875rem', color: '#FFB673' }}>Play Now →</button>
      </div>
    </div>
  );
}

export default ProductCard;
