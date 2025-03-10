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
    <div className={`mb-8 rounded-xl overflow-hidden transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100 border border-gray-700 shadow-md shadow-gray-950/50' 
        : 'bg-white text-gray-900 border border-gray-300 shadow-md shadow-gray-200/70'
    } ${
      isCyberpunk 
        ? 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
        : 'hover:shadow-lg transform hover:-translate-y-0.5 transition-all'
    }`}>
      <div 
        className={`flex justify-between items-center p-5 cursor-pointer ${
          isCyberpunk 
            ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white' 
            : isDarkMode 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-b border-gray-700' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border-b border-gray-300'
        }`}
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold tracking-wide">{title}</h2>
        <div className="bg-opacity-20 p-1.5 rounded-full transition-colors duration-200 hover:bg-white hover:bg-opacity-10">
          {isExpanded ? 
            <ChevronUp size={20} className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} /> : 
            <ChevronDown size={20} className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
          }
        </div>
      </div>
      {isExpanded && (
        <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default Section; 