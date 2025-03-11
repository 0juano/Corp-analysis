import { useState } from 'react';
import { FormData, Development, Point } from '../types';

/**
 * Initialize form data with default values
 * 
 * @returns Default form data
 */
const initializeFormData = (): FormData => ({
  business: '',
  ownership: '',
  industry: '',
  earnings: '',
  developments: Array(5).fill({ emoji: 'up', text: '' } as Development)
    .map((_, i) => ({ emoji: 'up', text: '', visible: i === 0 })),
  positives: Array(5).fill({ text: '' } as Point)
    .map((_, i) => ({ text: '', visible: i === 0 })),
  negatives: Array(5).fill({ text: '' } as Point)
    .map((_, i) => ({ text: '', visible: i === 0 }))
});

/**
 * Custom hook for managing form data
 * 
 * @returns Form data state and handlers
 */
export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(initializeFormData());

  // Text field handlers
  const textFieldHandlers = useTextFieldHandlers(formData, setFormData);
  
  // Development handlers
  const developmentHandlers = useDevelopmentHandlers(formData, setFormData);
  
  // Point handlers
  const pointHandlers = usePointHandlers(formData, setFormData);

  return {
    formData,
    ...textFieldHandlers,
    ...developmentHandlers,
    ...pointHandlers
  };
};

/**
 * Hook for text field handlers
 * 
 * @param formData - The form data
 * @param setFormData - Function to update form data
 * @returns Text field handlers
 */
const useTextFieldHandlers = (
  formData: FormData, 
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  /**
   * Handle input change for text fields
   * 
   * @param section - The section to update
   * @param value - The new value
   */
  const handleInputChange = (
    section: keyof Pick<FormData, 'business' | 'ownership' | 'industry' | 'earnings'>, 
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  return { handleInputChange };
};

/**
 * Hook for development handlers
 * 
 * @param formData - The form data
 * @param setFormData - Function to update form data
 * @returns Development handlers
 */
const useDevelopmentHandlers = (
  formData: FormData, 
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  /**
   * Handle development change
   * 
   * @param index - The index of the development to update
   * @param field - The field to update
   * @param value - The new value
   */
  const handleDevelopmentChange = (
    index: number, 
    field: keyof Development, 
    value: string | 'up' | 'down' | boolean
  ) => {
    setFormData(prev => {
      const newDevelopments = [...prev.developments];
      if (field === 'emoji' && (value === 'up' || value === 'down')) {
        newDevelopments[index] = {
          ...newDevelopments[index],
          emoji: value
        };
      } else if (field === 'text' && typeof value === 'string') {
        newDevelopments[index] = {
          ...newDevelopments[index],
          text: value
        };
      } else if (field === 'visible' && typeof value === 'boolean') {
        newDevelopments[index] = {
          ...newDevelopments[index],
          visible: value
        };
      }
      return { ...prev, developments: newDevelopments };
    });
  };

  /**
   * Remove a development
   * 
   * @param index - The index of the development to remove
   */
  const removeDevelopment = (index: number) => {
    setFormData(prev => {
      const newDevelopments = prev.developments.filter((_, i) => i !== index);
      return { ...prev, developments: newDevelopments };
    });
  };

  /**
   * Add a new development
   */
  const addDevelopment = () => {
    setFormData(prev => {
      const newDevelopments = [...prev.developments, { emoji: 'up' as const, text: '', visible: true }];
      return { ...prev, developments: newDevelopments };
    });
  };

  return { handleDevelopmentChange, removeDevelopment, addDevelopment };
};

/**
 * Hook for point handlers
 * 
 * @param formData - The form data
 * @param setFormData - Function to update form data
 * @returns Point handlers
 */
const usePointHandlers = (
  formData: FormData, 
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  /**
   * Handle point change
   * 
   * @param section - The section to update (positives or negatives)
   * @param index - The index of the point to update
   * @param value - The new value
   */
  const handlePointChange = (section: 'positives' | 'negatives', index: number, value: string) => {
    setFormData(prev => {
      const newPoints = [...prev[section]];
      newPoints[index] = { ...newPoints[index], text: value };
      return { ...prev, [section]: newPoints };
    });
  };

  /**
   * Remove a point
   * 
   * @param section - The section to update (positives or negatives)
   * @param index - The index of the point to remove
   */
  const removePoint = (section: 'positives' | 'negatives', index: number) => {
    setFormData(prev => {
      const newPoints = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: newPoints };
    });
  };

  /**
   * Add a new point
   * 
   * @param section - The section to update (positives or negatives)
   */
  const addPoint = (section: 'positives' | 'negatives') => {
    setFormData(prev => {
      const newPoints = [...prev[section], { text: '', visible: true }];
      return { ...prev, [section]: newPoints };
    });
  };

  return { handlePointChange, removePoint, addPoint };
}; 