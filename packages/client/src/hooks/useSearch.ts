import { useState } from 'react';
import { getCompanyNameFromIsin } from '../utils/yahooFinance';

/**
 * Custom hook for managing search functionality
 * 
 * @returns Search state and handlers
 */
export const useSearch = () => {
  const [isin, setIsin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ticker, setTicker] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /**
   * Handle ISIN submission
   * 
   * @param e - The keyboard event
   */
  const handleIsinSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isin.trim()) {
      setIsSearching(true);
      setSearchError(null);
      setCompanyName('');
      setTicker('');
      
      try {
        // Fetch company info from Yahoo Finance API
        const companyInfo = await getCompanyNameFromIsin(isin);
        
        if (companyInfo) {
          setCompanyName(companyInfo.company_name);
          setTicker(companyInfo.ticker);
        } else {
          setSearchError(`No company found for ISIN: ${isin}`);
        }
      } catch (error) {
        console.error('Error in ISIN submission:', error);
        setSearchError('Error connecting to company lookup service. Please try again later.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  /**
   * Handle print functionality
   * 
   * @param beforePrint - Optional callback to execute before printing
   */
  const handlePrint = (beforePrint?: () => void) => {
    if (beforePrint) {
      beforePrint();
      
      // Allow time for the UI to update before printing
      setTimeout(() => {
        // Add a data attribute to the document body to preserve the current theme mode
        document.body.dataset.printMode = document.body.classList.contains('dark') ? 'dark' : 'light';
        window.print();
      }, 100);
    } else {
      // Add a data attribute to the document body to preserve the current theme mode
      document.body.dataset.printMode = document.body.classList.contains('dark') ? 'dark' : 'light';
      window.print();
    }
  };

  return {
    isin,
    setIsin,
    companyName,
    setCompanyName,
    ticker,
    setTicker,
    isSearching,
    setIsSearching,
    searchError,
    setSearchError,
    handleIsinSubmit,
    handlePrint
  };
}; 