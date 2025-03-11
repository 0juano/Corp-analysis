import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Props for the ResizableTextarea component
 */
interface ResizableTextareaProps {
  /** The current value of the textarea */
  value: string;
  /** Callback function triggered when the textarea value changes */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Placeholder text to display when the textarea is empty */
  placeholder?: string;
  /** Additional CSS classes to apply to the textarea */
  className?: string;
}

/**
 * A textarea component that automatically resizes based on content
 */
export const ResizableTextarea: React.FC<ResizableTextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  /**
   * Adjusts the height of the textarea based on content
   */
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // First reset height to zero to fully collapse
    textarea.style.height = '0px';
    
    // Then set to auto to get correct scrollHeight
    textarea.style.height = 'auto';
    
    // Get the scrollHeight which is the height needed for content
    const scrollHeight = textarea.scrollHeight;
    
    // For empty or very short content, force exact 38px height
    if (value.trim().length === 0 || !value.includes('\n')) {
      textarea.style.height = '38px';
    } else {
      // For multiline content, use scrollHeight but ensure minimum 38px
      textarea.style.height = `${Math.max(scrollHeight, 38)}px`;
    }
  }, [value]);
  
  // Run on value changes
  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);
  
  // Run on mount to set initial size
  useEffect(() => {
    if (textareaRef.current) {
      // Force exact height on mount
      textareaRef.current.style.height = '38px';
    }
  }, []);
  
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e);
        // Run immediately for faster response
        adjustHeight();
      }}
      onKeyUp={adjustHeight}
      onKeyDown={adjustHeight}
      onPaste={() => setTimeout(adjustHeight, 0)}
      placeholder={placeholder}
      className={`resize-none ${className}`}
      style={{ 
        minHeight: '38px',
        padding: '8px 12px',
        lineHeight: '22px',
        boxSizing: 'border-box',
        overflowY: 'hidden'
      }}
    />
  );
};

export default ResizableTextarea;
