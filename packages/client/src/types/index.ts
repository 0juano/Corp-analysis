/**
 * Development item with emoji indicator and text
 */
export interface Development {
  emoji: 'up' | 'down';
  text: string;
  visible: boolean;
}

/**
 * Point item with text content
 */
export interface Point {
  text: string;
  visible: boolean;
}

/**
 * Chat message structure
 */
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

/**
 * Source reference structure
 */
export interface Source {
  id: string;
  url: string;
  timestamp: number;
}

/**
 * Link preview metadata
 */
export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * Form data structure for the analyst report
 */
export interface FormData {
  business: string;
  ownership: string;
  industry: string;
  earnings: string;
  developments: Development[];
  positives: Point[];
  negatives: Point[];
}

/**
 * Section component props
 */
export interface SectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  isCyberpunk: boolean;
} 