import { useState } from 'react';

/**
 * Custom hook for managing UI state
 * 
 * @returns UI state and handlers
 */
export const useUIState = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true,
    ownership: true,
    industry: true,
    earnings: true,
    developments: true,
    analysis: true
  });

  /**
   * Toggle a section's expanded state
   * 
   * @param section - The section to toggle
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  /**
   * Adjust the height of a textarea
   * 
   * @param element - The textarea element
   */
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  return {
    expandedSections,
    toggleSection,
    adjustHeight
  };
}; 