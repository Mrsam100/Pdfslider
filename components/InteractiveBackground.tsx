/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

// Static noise/grain effect for that "newspaper" feel
const InteractiveBackground: React.FC = () => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100"
         style={{ pointerEvents: 'none', zIndex: 0, opacity: 0.2, mixBlendMode: 'multiply', backgroundColor: '#fdfbf7' }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-100 h-100" style={{ opacity: 0.3 }}>
            <filter id="noiseFilter">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="3"
                    stitchTiles="stitch" />
            </filter>

            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
    </div>
  );
};

export default InteractiveBackground;
