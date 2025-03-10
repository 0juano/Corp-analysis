import { useState } from 'react';

/**
 * Custom hook for managing search functionality
 * 
 * @returns Search state and handlers
 */
export const useSearch = () => {
  const [isin, setIsin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Handle ISIN submission
   * 
   * @param e - The keyboard event
   */
  const handleIsinSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isin.trim()) {
      setIsSearching(true);
      
      // Simulate API call
      setTimeout(() => {
        setCompanyName(`Company for ISIN: ${isin}`);
        setIsSearching(false);
      }, 1000);
    }
  };

  /**
   * Handle print functionality
   */
  const handlePrint = () => {
    window.print();
  };

  return {
    isin,
    setIsin,
    companyName,
    setCompanyName,
    isSearching,
    setIsSearching,
    handleIsinSubmit,
    handlePrint
  };
}; 