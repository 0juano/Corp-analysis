/**
 * Yahoo Finance API utilities
 * 
 * Functions for interacting with the Yahoo Finance API
 */

/**
 * Fetches company information from an ISIN using Yahoo Finance API via our proxy server
 * 
 * @param isin - International Securities Identification Number
 * @returns Promise resolving to company information or null if not found
 */
export const getCompanyNameFromIsin = async (isin: string): Promise<{ 
  company_name: string; 
  ticker: string;
  isin: string;
} | null> => {
  try {
    // Use our local proxy server to avoid CORS issues
    const proxyUrl = 'http://localhost:3001/api/yahoo-finance/search';
    
    const response = await fetch(`${proxyUrl}?isin=${encodeURIComponent(isin)}`);
    
    if (!response.ok) {
      throw new Error(`Proxy server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Log the response for debugging
    console.log('Yahoo Finance API response:', data);
    
    if (data.quotes && data.quotes.length > 0) {
      const quote = data.quotes[0];
      // Return structured data similar to the Python example
      return {
        company_name: quote.longname || quote.shortname || '',
        ticker: quote.symbol || '',
        isin: isin
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching company name:', error);
    return null;
  }
}; 