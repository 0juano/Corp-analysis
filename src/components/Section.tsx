import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SectionProps } from '../types';

/**
 * Section component with collapsible content
 * 
 * @param title - The title of the section
 * @param children - The content of the section
 * @param isExpanded - Whether the section is expanded or collapsed
 * @param onToggle - Function to toggle the section's expanded state
 * @param isDarkMode - Whether dark mode is enabled
 * @param isCyberpunk - Whether cyberpunk theme is enabled
 * @returns A collapsible section component
 */
function Section({ title, children, isExpanded, onToggle, isDarkMode, isCyberpunk }: SectionProps) {
  return (
    <div className={`mb-6 rounded-lg overflow-hidden ${
      isDarkMode 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-800 border border-gray-200'
    } ${
      isCyberpunk 
        ? 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
        : ''
    }`}>
      <div 
        className={`flex justify-between items-center p-4 cursor-pointer ${
          isCyberpunk 
            ? 'bg-gradient-to-r from-purple-900 to-indigo-900' 
            : isDarkMode 
              ? 'bg-gray-700' 
              : 'bg-gray-100'
        }`}
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isExpanded && (
        <div className="p-5">
          {children}
        </div>
      )}
    </div>
  );
}

export default Section; 