import React from 'react';

interface LogoProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  primaryLogoSrc?: string;
  secondaryLogoSrc?: string;
}

export const PathformanceLogo: React.FC<LogoProps> = ({ 
  variant = 'primary', 
  className = '', 
  size = 'md',
  primaryLogoSrc = '/logos/pathformance-logo-primary.png',
  secondaryLogoSrc = '/logos/pathformance-logo-secondary.png'
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  // If the logo file doesn't exist yet, this fallback text will be displayed
  const textFallback = variant === 'primary' ? 'Pathformance' : 'P';

  if (variant === 'primary') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <img 
          src={primaryLogoSrc} 
          alt="Pathformance" 
          className={`${sizeClasses[size]}`}
          onError={(e) => {
            // Show SVG fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML += `
              <div class="${sizeClasses[size]} text-pathformance-teal flex items-center justify-center">
                <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100c55.2 0 100-44.8 100-100S155.2 0 100 0zm20 160H80V40h40c22.1 0 40 17.9 40 40s-17.9 40-40 40h-20v40zm0-60c11 0 20-9 20-20s-9-20-20-20h-20v40h20z"/>
                </svg>
              </div>
              <div class="mt-1 text-pathformance-teal font-sans text-sm font-medium">
                ${textFallback}
              </div>
            `;
          }}
        />
      </div>
    );
  } else {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src={secondaryLogoSrc} 
          alt="Pathformance" 
          className={`${sizeClasses[size]}`}
          onError={(e) => {
            // Show SVG fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML += `
              <div class="flex items-center">
                <div class="${sizeClasses[size]} text-pathformance-teal">
                  <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100c55.2 0 100-44.8 100-100S155.2 0 100 0zm20 160H80V40h40c22.1 0 40 17.9 40 40s-17.9 40-40 40h-20v40zm0-60c11 0 20-9 20-20s-9-20-20-20h-20v40h20z"/>
                  </svg>
                </div>
                <div class="ml-2 text-pathformance-teal font-sans text-xl font-medium">
                  athformance
                </div>
              </div>
            `;
          }}
        />
      </div>
    );
  }
};

export default PathformanceLogo; 