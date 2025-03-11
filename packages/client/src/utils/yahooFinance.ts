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
    
    // First try searching with the ISIN directly
    let response = await fetch(`${proxyUrl}?isin=${encodeURIComponent(isin)}`);
    
    if (!response.ok) {
      throw new Error(`Proxy server error: ${response.status}`);
    }
    
    let data = await response.json();
    
    // Enhanced logging for debugging
    console.log('Yahoo Finance API response for ISIN search:', JSON.stringify(data, null, 2));
    
    // Try to extract company info from the response
    let companyInfo = extractCompanyInfo(data, isin);
    
    // If we couldn't find company info with the ISIN directly, try to extract the ticker from the ISIN
    // and search for that instead
    if (!companyInfo || !companyInfo.company_name) {
      // Extract potential ticker from ISIN (usually last 9 characters contain some form of the ticker)
      const potentialTicker = isin.substring(isin.length - 9);
      console.log(`No company found with ISIN, trying with potential ticker: ${potentialTicker}`);
      
      // Try searching with the potential ticker
      response = await fetch(`${proxyUrl}?isin=${encodeURIComponent(potentialTicker)}`);
      
      if (response.ok) {
        data = await response.json();
        console.log('Yahoo Finance API response for ticker search:', JSON.stringify(data, null, 2));
        
        // Try to extract company info from the ticker search response
        companyInfo = extractCompanyInfo(data, isin);
      }
    }
    
    return companyInfo;
  } catch (error) {
    console.error('Error fetching company name:', error);
    return null;
  }
};

/**
 * Helper function to extract company information from Yahoo Finance API response
 * 
 * @param data - Yahoo Finance API response data
 * @param isin - Original ISIN for reference
 * @returns Company information or null if not found
 */
const extractCompanyInfo = (data: any, isin: string): { 
  company_name: string; 
  ticker: string;
  isin: string;
} | null => {
  if (data.quotes && data.quotes.length > 0) {
    const quote = data.quotes[0];
    
    // Log the specific quote object to see its structure
    console.log('First quote object:', JSON.stringify(quote, null, 2));
    
    // Check all possible name properties that might exist in the API response
    const companyName = quote.longname || quote.shortname || quote.name || quote.displayName || quote.title || '';
    
    if (!companyName) {
      console.warn('No company name found in the response. Available fields:', Object.keys(quote));
    }
    
    // Return structured data similar to the Python example
    return {
      company_name: companyName,
      ticker: quote.symbol || '',
      isin: isin
    };
  } else if (data.results && data.results.length > 0) {
    // Alternative response structure
    const result = data.results[0];
    console.log('First result object:', JSON.stringify(result, null, 2));
    
    const companyName = result.longname || result.shortname || result.name || result.displayName || result.title || '';
    
    if (!companyName) {
      console.warn('No company name found in results. Available fields:', Object.keys(result));
    }
    
    return {
      company_name: companyName,
      ticker: result.symbol || '',
      isin: isin
    };
  } else {
    console.warn('No quotes or results found in the Yahoo Finance API response:', data);
    return null;
  }
};