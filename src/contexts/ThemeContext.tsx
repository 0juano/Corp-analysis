import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Theme context interface
 */
interface ThemeContextType {
  isDarkMode: boolean;
  isCyberpunk: boolean;
  toggleDarkMode: () => void;
  toggleCyberpunk: () => void;
}

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Context for managing theme settings (dark mode and cyberpunk theme)
 */
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  isCyberpunk: false,
  /**
   * Default toggle dark mode function (replaced by actual implementation in provider)
   */
  toggleDarkMode: () => {},
  /**
   * Default toggle cyberpunk theme function (replaced by actual implementation in provider)
   */
  toggleCyberpunk: () => {},
});

/**
 * Custom hook to use the theme context
 * 
 * @returns The theme context
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Theme provider component
 * 
 * @param children - The child components
 * @returns The theme provider component
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCyberpunk, setIsCyberpunk] = useState(false);

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  /**
   * Toggle cyberpunk theme
   */
  const toggleCyberpunk = () => {
    setIsCyberpunk(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, isCyberpunk, toggleDarkMode, toggleCyberpunk }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 