import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ChevronUp, ChevronDown, X, Search, Printer, Send, Bot } from 'lucide-react';
import { useSearch } from './hooks/useSearch';

interface Development {
  emoji: 'up' | 'down';
  text: string;
  visible: boolean;
}

interface Point {
  text: string;
  visible: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface Source {
  id: string;
  url: string;
  timestamp: number;
  section: 'business' | 'ownership' | 'industry' | 'earnings' | 'developments';
}

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { 
    isin, 
    setIsin, 
    companyName,
    ticker, 
    isSearching, 
    setIsSearching,
    searchError,
    handleIsinSubmit,
    handlePrint 
  } = useSearch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [showSourceInput, setShowSourceInput] = useState<string | null>(null);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [linkPreviews, setLinkPreviews] = useState<Record<string, LinkPreview>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true,
    ownership: true,
    industry: true,
    earnings: true,
    developments: true,
    positives: true,
    negatives: true,
    chat: true
  });

  const [formData, setFormData] = useState({
    business: '',
    ownership: '',
    industry: '',
    earnings: '',
    developments: Array(5).fill({ emoji: 'up', text: '' } as Development).map((_, i) => ({ emoji: 'up', text: '', visible: i === 0 })),
    positives: Array(5).fill({ text: '' } as Point).map((_, i) => ({ text: '', visible: i === 0 })),
    negatives: Array(5).fill({ text: '' } as Point).map((_, i) => ({ text: '', visible: i === 0 }))
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Adjust textarea heights on mount and when developments change
  useEffect(() => {
    if (expandedSections.developments) {
      adjustAllTextareaHeights('.developments-section textarea');
    }
    
    if (expandedSections.analysis) {
      adjustAllTextareaHeights('.analysis-section textarea');
    }
  }, [
    expandedSections.developments, 
    expandedSections.analysis, 
    formData.developments.filter(d => d.visible).length
  ]);

  const fetchLinkPreview = async (url: string) => {
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.status === 'success') {
        setLinkPreviews(prev => ({
          ...prev,
          [url]: {
            title: data.data.title || '',
            description: data.data.description || '',
            image: data.data.image?.url || '',
            url: url
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching link preview:', error);
    }
  };

  const handleAddSource = (section: 'business' | 'ownership' | 'industry' | 'earnings' | 'developments') => {
    if (newSourceUrl && newSourceUrl.startsWith('http')) {
      const newSource: Source = {
        id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: newSourceUrl,
        timestamp: Date.now(),
        section
      };
      setSources(prevSources => [...prevSources, newSource]);
      setNewSourceUrl('');
      setShowSourceInput(null);
      fetchLinkPreview(newSourceUrl);
    }
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
    // Clean up the preview data
    const sourceToRemove = sources.find(source => source.id === id);
    if (sourceToRemove) {
      setLinkPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[sourceToRemove.url];
        return newPreviews;
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsChatLoading(true);

    try {
      // Call the Cohere API through our backend
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: currentMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Cohere API');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.analysis || "Sorry, I couldn't process your request at this time.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Cohere API:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error connecting to the analysis service. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleInputChange = (section: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleDevelopmentChange = (index: number, field: keyof Development, value: string) => {
    const developments = [...formData.developments];
    developments[index] = {
      ...developments[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, developments }));
    
    // Adjust heights of all development textareas
    adjustAllTextareaHeights('.developments-section textarea');
  };

  const handlePointChange = (section: 'positives' | 'negatives', index: number, value: string) => {
    const points = [...formData[section]];
    points[index] = {
      ...points[index],
      text: value
    };
    setFormData(prev => ({ ...prev, [section]: points }));
  };

  const removePoint = (section: 'positives' | 'negatives', index: number) => {
    const points = [...formData[section]];
    points[index] = { ...points[index], visible: false };
    setFormData(prev => ({ ...prev, [section]: points }));
  };

  const addPoint = (section: 'positives' | 'negatives') => {
    const points = [...formData[section]];
    const nextIndex = points.findIndex(p => !p.visible);
    if (nextIndex !== -1) {
      points[nextIndex] = { text: '', visible: true };
      setFormData(prev => ({ ...prev, [section]: points }));
    }
  };

  const removeDevelopment = (index: number) => {
    const developments = [...formData.developments];
    developments[index] = { ...developments[index], visible: false };
    setFormData(prev => ({ ...prev, developments }));
    
    // Adjust heights of all development textareas
    adjustAllTextareaHeights('.developments-section textarea');
  };

  const addDevelopment = () => {
    const developments = [...formData.developments];
    const nextIndex = developments.findIndex(d => !d.visible);
    if (nextIndex !== -1) {
      developments[nextIndex] = { emoji: 'up', text: '', visible: true };
      setFormData(prev => ({ ...prev, developments }));
      
      // Adjust heights of all development textareas
      adjustAllTextareaHeights('.developments-section textarea');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const inputClass = `rounded-md border ${
    isDarkMode
      ? 'bg-gray-900 border-gray-600 text-gray-100 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400'
      : 'bg-white border-gray-400 text-gray-900 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500'
  } focus:outline-none focus:ring-2 w-full px-3 py-2`;

  const textareaClass = `${inputClass} min-h-[100px] resize-none w-full`;
  
  const multilineInputClass = `${inputClass} h-[32px] min-h-[32px] resize-none overflow-hidden`;

  const adjustHeight = (element: HTMLTextAreaElement) => {
    // Reset height to minimum to accurately calculate the new height
    element.style.height = '32px';
    // Get the scrollHeight which represents the height needed to fit all content
    const scrollHeight = element.scrollHeight;
    // If content requires more height than minimum, adjust it
    if (scrollHeight > 32) {
      element.style.height = `${Math.min(scrollHeight, 200)}px`;
    } else {
      // Ensure height is set to minimum when content doesn't require more space
      element.style.height = '32px';
    }
  };

  // Helper function to adjust heights of all textareas in a section
  const adjustAllTextareaHeights = (selector: string) => {
    setTimeout(() => {
      const textareas = document.querySelectorAll(selector);
      textareas.forEach(textarea => {
        adjustHeight(textarea as HTMLTextAreaElement);
      });
    }, 0);
  };

  const visibleDevelopments = formData.developments.filter(d => d.visible);
  const canAddDevelopment = visibleDevelopments.length < 5;

  // Add a function to prepare for printing
  /**
   * Prepares the document for printing by expanding all sections
   */
  const prepareForPrinting = () => {
    const allExpanded = Object.keys(expandedSections).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setExpandedSections(allExpanded);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row h-screen relative">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-0 flex flex-col items-center">
          <div className="container mx-auto px-4 py-4 max-w-4xl print:px-2 print:py-1 w-full md:px-8">
            <div className="mb-8 print:mb-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    value={isin}
                    onChange={(e) => setIsin(e.target.value.toUpperCase())}
                    onKeyDown={handleIsinSubmit}
                    placeholder="Enter ISIN"
                    className={`${inputClass} py-1 px-2 w-36 text-lg font-mono uppercase`}
                    maxLength={12}
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Search className={`h-5 w-5 text-blue-500 animate-spin`} />
                    </div>
                  )}
                </div>
                
                {(isSearching || companyName) && (
                  <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex-grow`}>
                    {isSearching ? (
                      <span className="animate-pulse text-lg">Searching...</span>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold" title={companyName}>
                          {companyName.length > 40 ? `${companyName.substring(0, 40)}...` : companyName}
                        </h2>
                        {ticker && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ticker: {ticker}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {searchError && (
                  <div className="text-amber-500 flex-grow">
                    <p>{searchError}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint(prepareForPrinting)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Printer size={18} />
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {/* Chat toggle button for mobile */}
                  <button
                    onClick={() => setIsChatVisible(!isChatVisible)}
                    className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden md:hidden ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    title={isChatVisible ? "Hide chat" : "Show chat"}
                  >
                    <Bot className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {isin && isin.length !== 12 && (
                <p className="mt-1 text-sm text-amber-500">
                  ISIN must be exactly 12 characters
                </p>
              )}
            </div>

            <div className="space-y-4 print:space-y-1 w-full">
              <Section
                title="Business Overview"
                isExpanded={expandedSections.business}
                onToggle={() => toggleSection('business')}
                isDarkMode={isDarkMode}
              >
                <div className="space-y-2">
                  <textarea
                    placeholder="Enter business overview..."
                    value={formData.business}
                    onChange={(e) => {
                      handleInputChange('business', e.target.value);
                      adjustHeight(e.target);
                    }}
                    onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                    className={textareaClass}
                  />
                  <div className="flex flex-wrap gap-2 items-center mt-2">
                    <button
                      onClick={() => setShowSourceInput('business')}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 shadow-sm shadow-blue-900/20'
                          : 'bg-gray-200 text-blue-600 hover:bg-gray-300 hover:text-blue-700 shadow-sm'
                      } flex items-center justify-center print:hidden`}
                    >
                      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current">+</span>
                    </button>
                    {sources.filter(source => source.section === 'business').map((source, index) => (
                      <div key={source.id} className="relative group">
                        <div className="flex items-center gap-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode
                                ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                                : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                            } flex items-center gap-1 relative group`}
                          >
                            <span>({index + 1})</span>
                            {/* Hover preview */}
                            {linkPreviews[source.url] && (
                              <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                                <div className={`rounded-lg shadow-lg overflow-hidden ${
                                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                                }`}>
                                  {linkPreviews[source.url].image && (
                                    <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                      <img 
                                        src={linkPreviews[source.url].image} 
                                        alt={linkPreviews[source.url].title || 'Link preview'} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="p-3">
                                    <h4 className={`font-bold text-sm mb-1 truncate ${
                                      isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                      {linkPreviews[source.url].title || new URL(source.url).hostname}
                                    </h4>
                                    <p className={`text-xs line-clamp-2 ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                      {linkPreviews[source.url].description || 'No description available'}
                                    </p>
                                    <p className={`text-xs mt-1 truncate ${
                                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {new URL(source.url).hostname}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </a>
                          <button
                            onClick={() => handleRemoveSource(source.id)}
                            className={`p-1 rounded-full ${
                              isDarkMode
                                ? 'text-red-500 hover:text-red-700'
                                : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                            } print:hidden flex-shrink-0`}
                            title="Remove source"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {showSourceInput === 'business' ? (
                      <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                        <input
                          type="text"
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          placeholder="Enter URL"
                          className={`text-xs py-1.5 px-3 rounded-md border ${
                            isDarkMode
                              ? 'bg-gray-900 border-gray-600 text-gray-100 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400'
                              : 'bg-white border-gray-400 text-gray-900 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 w-full sm:w-auto text-[11px]`}
                        />
                        <div className="flex gap-1 mt-1 sm:mt-0">
                          <button
                            onClick={() => handleAddSource('business')}
                            className={`px-2 py-1 rounded-md text-[11px] ${
                              isDarkMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowSourceInput(null);
                              setNewSourceUrl('');
                            }}
                            className={`px-2 py-1 rounded-md text-[11px] ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      null
                    )}
                  </div>
                </div>
              </Section>

              <Section
                title="Ownership & Management"
                isExpanded={expandedSections.ownership}
                onToggle={() => toggleSection('ownership')}
                isDarkMode={isDarkMode}
              >
                <textarea
                  placeholder="Enter ownership and management details..."
                  value={formData.ownership}
                  onChange={(e) => {
                    handleInputChange('ownership', e.target.value);
                    adjustHeight(e.target);
                  }}
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                  className={textareaClass}
                />
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <button
                    onClick={() => setShowSourceInput('ownership')}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 shadow-sm shadow-blue-900/20'
                        : 'bg-gray-200 text-blue-600 hover:bg-gray-300 hover:text-blue-700 shadow-sm'
                    } flex items-center justify-center print:hidden`}
                  >
                    <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current">+</span>
                  </button>
                  {sources.filter(source => source.section === 'ownership').map((source, index) => (
                    <div key={source.id} className="relative group">
                      <div className="flex items-center gap-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                              : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                          } flex items-center gap-1 relative group`}
                        >
                          <span>({index + 1})</span>
                          {/* Hover preview */}
                          {linkPreviews[source.url] && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                              <div className={`rounded-lg shadow-lg overflow-hidden ${
                                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                              }`}>
                                {linkPreviews[source.url].image && (
                                  <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                    <img 
                                      src={linkPreviews[source.url].image} 
                                      alt={linkPreviews[source.url].title || 'Link preview'} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-3">
                                  <h4 className={`font-bold text-sm mb-1 truncate ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                  }`}>
                                    {linkPreviews[source.url].title || new URL(source.url).hostname}
                                  </h4>
                                  <p className={`text-xs line-clamp-2 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {linkPreviews[source.url].description || 'No description available'}
                                  </p>
                                  <p className={`text-xs mt-1 truncate ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {new URL(source.url).hostname}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </a>
                        <button
                          onClick={() => handleRemoveSource(source.id)}
                          className={`p-1 rounded-full ${
                            isDarkMode
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                          } print:hidden flex-shrink-0`}
                          title="Remove source"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {showSourceInput === 'ownership' ? (
                    <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                      <input
                        type="text"
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                        placeholder="Enter URL"
                        className={`text-xs py-1.5 px-3 rounded-md border ${
                          isDarkMode
                            ? 'bg-gray-900 border-gray-600 text-gray-100 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400'
                            : 'bg-white border-gray-400 text-gray-900 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 w-full sm:w-auto text-[11px]`}
                      />
                      <div className="flex gap-1 mt-1 sm:mt-0">
                        <button
                          onClick={() => handleAddSource('ownership')}
                          className={`px-2 py-1 rounded-md text-[11px] ${
                            isDarkMode
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowSourceInput(null);
                            setNewSourceUrl('');
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] ${
                            isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    null
                  )}
                </div>
              </Section>

              <Section
                title="Industry & Competition"
                isExpanded={expandedSections.industry}
                onToggle={() => toggleSection('industry')}
                isDarkMode={isDarkMode}
              >
                <textarea
                  placeholder="Enter industry and competition analysis..."
                  value={formData.industry}
                  onChange={(e) => {
                    handleInputChange('industry', e.target.value);
                    adjustHeight(e.target);
                  }}
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                  className={textareaClass}
                />
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <button
                    onClick={() => setShowSourceInput('industry')}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 shadow-sm shadow-blue-900/20'
                        : 'bg-gray-200 text-blue-600 hover:bg-gray-300 hover:text-blue-700 shadow-sm'
                    } flex items-center justify-center print:hidden`}
                  >
                    <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current">+</span>
                  </button>
                  {sources.filter(source => source.section === 'industry').map((source, index) => (
                    <div key={source.id} className="relative group">
                      <div className="flex items-center gap-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                              : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                          } flex items-center gap-1 relative group`}
                        >
                          <span>({index + 1})</span>
                          {/* Hover preview */}
                          {linkPreviews[source.url] && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                              <div className={`rounded-lg shadow-lg overflow-hidden ${
                                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                              }`}>
                                {linkPreviews[source.url].image && (
                                  <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                    <img 
                                      src={linkPreviews[source.url].image} 
                                      alt={linkPreviews[source.url].title || 'Link preview'} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-3">
                                  <h4 className={`font-bold text-sm mb-1 truncate ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                  }`}>
                                    {linkPreviews[source.url].title || new URL(source.url).hostname}
                                  </h4>
                                  <p className={`text-xs line-clamp-2 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {linkPreviews[source.url].description || 'No description available'}
                                  </p>
                                  <p className={`text-xs mt-1 truncate ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {new URL(source.url).hostname}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </a>
                        <button
                          onClick={() => handleRemoveSource(source.id)}
                          className={`p-1 rounded-full ${
                            isDarkMode
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                          } print:hidden flex-shrink-0`}
                          title="Remove source"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {showSourceInput === 'industry' ? (
                    <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                      <input
                        type="text"
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                        placeholder="Enter URL"
                        className={`text-xs py-1.5 px-3 rounded-md border ${
                          isDarkMode
                            ? 'bg-gray-900 border-gray-600 text-gray-100 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400'
                            : 'bg-white border-gray-400 text-gray-900 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 w-full sm:w-auto text-[11px]`}
                      />
                      <div className="flex gap-1 mt-1 sm:mt-0">
                        <button
                          onClick={() => handleAddSource('industry')}
                          className={`px-2 py-1 rounded-md text-[11px] ${
                            isDarkMode
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowSourceInput(null);
                            setNewSourceUrl('');
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] ${
                            isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    null
                  )}
                </div>
              </Section>

              <Section
                title="Latest Earnings & Financial Snapshot"
                isExpanded={expandedSections.earnings}
                onToggle={() => toggleSection('earnings')}
                isDarkMode={isDarkMode}
              >
                <textarea
                  placeholder="Enter earnings and financial details..."
                  value={formData.earnings}
                  onChange={(e) => {
                    handleInputChange('earnings', e.target.value);
                    adjustHeight(e.target);
                  }}
                  onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                  className={textareaClass}
                />
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <button
                    onClick={() => setShowSourceInput('earnings')}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 shadow-sm shadow-blue-900/20'
                        : 'bg-gray-200 text-blue-600 hover:bg-gray-300 hover:text-blue-700 shadow-sm'
                    } flex items-center justify-center print:hidden`}
                  >
                    <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current">+</span>
                  </button>
                  {sources.filter(source => source.section === 'earnings').map((source, index) => (
                    <div key={source.id} className="relative group">
                      <div className="flex items-center gap-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode
                              ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                              : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                          } flex items-center gap-1 relative group`}
                        >
                          <span>({index + 1})</span>
                          {/* Hover preview */}
                          {linkPreviews[source.url] && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                              <div className={`rounded-lg shadow-lg overflow-hidden ${
                                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                              }`}>
                                {linkPreviews[source.url].image && (
                                  <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                    <img 
                                      src={linkPreviews[source.url].image} 
                                      alt={linkPreviews[source.url].title || 'Link preview'} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="p-3">
                                  <h4 className={`font-bold text-sm mb-1 truncate ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                  }`}>
                                    {linkPreviews[source.url].title || new URL(source.url).hostname}
                                  </h4>
                                  <p className={`text-xs line-clamp-2 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {linkPreviews[source.url].description || 'No description available'}
                                  </p>
                                  <p className={`text-xs mt-1 truncate ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {new URL(source.url).hostname}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </a>
                        <button
                          onClick={() => handleRemoveSource(source.id)}
                          className={`p-1 rounded-full ${
                            isDarkMode
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                          } print:hidden flex-shrink-0`}
                          title="Remove source"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {showSourceInput === 'earnings' ? (
                    <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                      <input
                        type="text"
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                        placeholder="Enter URL"
                        className={`text-xs py-1.5 px-3 rounded-md border ${
                          isDarkMode
                            ? 'bg-gray-900 border-gray-600 text-gray-100 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400'
                            : 'bg-white border-gray-400 text-gray-900 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 w-full sm:w-auto text-[11px]`}
                      />
                      <div className="flex gap-1 mt-1 sm:mt-0">
                        <button
                          onClick={() => handleAddSource('earnings')}
                          className={`px-2 py-1 rounded-md text-[11px] ${
                            isDarkMode
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowSourceInput(null);
                            setNewSourceUrl('');
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] ${
                            isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    null
                  )}
                </div>
              </Section>

              <Section
                title="Key Developments"
                isExpanded={expandedSections.developments}
                onToggle={() => toggleSection('developments')}
                isDarkMode={isDarkMode}
              >
                <div className="space-y-3 developments-section">
                  {formData.developments.filter(d => d.visible).map((development, index) => (
                    <div key={`development-${index}`} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-2">
                        <button
                          onClick={() => handleDevelopmentChange(index, 'emoji', development.emoji === 'up' ? 'down' : 'up')}
                          className={`p-1 rounded-md ${
                            development.emoji === 'up'
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-red-500 dark:text-red-400'
                          }`}
                        >
                          {development.emoji === 'up' ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <div className="flex-grow">
                        <textarea
                          placeholder={`Development ${index + 1}`}
                          value={development.text}
                          onChange={(e) => {
                            handleDevelopmentChange(index, 'text', e.target.value);
                            adjustHeight(e.target);
                          }}
                          onFocus={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                          onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                          onKeyUp={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                          onPaste={(e) => setTimeout(() => adjustHeight(e.target as HTMLTextAreaElement), 0)}
                          className={`${multilineInputClass} flex-grow`}
                        />
                      </div>
                      <button
                        onClick={() => removeDevelopment(index)}
                        className={`p-2 h-8 flex items-center justify-center ${
                          isDarkMode
                            ? 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                            : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                        } print:hidden flex-shrink-0`}
                        title="Remove development"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {canAddDevelopment && (
                    <button
                      onClick={addDevelopment}
                      className={`w-full p-2 rounded-md text-sm border border-dashed print:hidden
                        ${isDarkMode 
                          ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                          : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                        }`}
                    >
                      + Add Development
                    </button>
                  )}
                  
                  {/* Add sources for developments section */}
                  <div className="flex flex-wrap gap-2 items-center mt-4">
                    <button
                      onClick={() => setShowSourceInput('developments')}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 shadow-sm shadow-blue-900/20'
                          : 'bg-gray-200 text-blue-600 hover:bg-gray-300 hover:text-blue-700 shadow-sm'
                      } flex items-center justify-center print:hidden`}
                    >
                      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current">+</span>
                    </button>
                    {sources.filter(source => source.section === 'developments').map((source, index) => (
                      <div key={source.id} className="relative group">
                        <div className="flex items-center gap-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode
                                ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                                : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                            } flex items-center gap-1 relative group`}
                          >
                            <span>({index + 1})</span>
                            {/* Hover preview */}
                            {linkPreviews[source.url] && (
                              <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                                <div className={`rounded-lg shadow-lg overflow-hidden ${
                                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                                }`}>
                                  {linkPreviews[source.url].image && (
                                    <div className="w-full h-32 bg-gray-100 overflow-hidden">
                                      <img 
                                        src={linkPreviews[source.url].image} 
                                        alt={linkPreviews[source.url].title || 'Link preview'} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="p-3">
                                    <h4 className={`font-bold text-sm mb-1 truncate ${
                                      isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                      {linkPreviews[source.url].title || new URL(source.url).hostname}
                                    </h4>
                                    <p className={`text-xs line-clamp-2 ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                      {linkPreviews[source.url].description || 'No description available'}
                                    </p>
                                    <p className={`text-xs mt-1 truncate ${
                                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {new URL(source.url).hostname}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </a>
                          <button
                            onClick={() => handleRemoveSource(source.id)}
                            className={`p-1 rounded-full ${
                              isDarkMode
                                ? 'text-red-500 hover:text-red-700'
                                : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                            } print:hidden flex-shrink-0`}
                            title="Remove source"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {showSourceInput === 'developments' ? (
                      <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                        <input
                          type="text"
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          placeholder="Enter URL"
                          className={`text-xs py-1.5 px-3 rounded-md border ${
                            isDarkMode
                              ? 'bg-gray-900 border-gray-600 text-gray-100 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-400'
                              : 'bg-white border-gray-400 text-gray-900 focus:ring-blue-600 focus:border-blue-600 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 w-full sm:w-auto text-[11px]`}
                        />
                        <div className="flex gap-1 mt-1 sm:mt-0">
                          <button
                            onClick={() => handleAddSource('developments')}
                            className={`px-2 py-1 rounded-md text-[11px] ${
                              isDarkMode
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowSourceInput(null);
                              setNewSourceUrl('');
                            }}
                            className={`px-2 py-1 rounded-md text-[11px] ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      null
                    )}
                  </div>
                </div>
              </Section>

              <Section
                title="Positives and Negatives"
                isExpanded={expandedSections.analysis}
                onToggle={() => toggleSection('analysis')}
                isDarkMode={isDarkMode}
              >
                <div className="space-y-4 analysis-section">
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="space-y-2">
                          {formData.positives.filter(p => p.visible).map((point, index) => (
                            <div key={`positive-${index}`} className="flex items-center gap-2">
                              <textarea
                                placeholder={`Positive ${index + 1}`}
                                value={point.text}
                                onChange={(e) => {
                                  handlePointChange('positives', index, e.target.value);
                                  adjustHeight(e.target);
                                }}
                                onFocus={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                onKeyUp={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                onPaste={(e) => setTimeout(() => adjustHeight(e.target as HTMLTextAreaElement), 0)}
                                className={`${multilineInputClass} flex-grow`}
                              />
                              <button
                                onClick={() => removePoint('positives', index)}
                                className={`p-2 h-8 flex items-center justify-center ${
                                  isDarkMode
                                    ? 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                    : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                } print:hidden flex-shrink-0`}
                                title="Remove positive"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {formData.positives.filter(p => p.visible).length < 5 && (
                            <button
                              onClick={() => addPoint('positives')}
                              className={`w-full p-2 mt-2 rounded-md text-sm border border-dashed print:hidden
                                ${isDarkMode 
                                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                                }`}
                            >
                              + Add Positive
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="space-y-2">
                          {formData.negatives.filter(p => p.visible).map((point, index) => (
                            <div key={`negative-${index}`} className="flex items-center gap-2">
                              <textarea
                                placeholder={`Negative ${index + 1}`}
                                value={point.text}
                                onChange={(e) => {
                                  handlePointChange('negatives', index, e.target.value);
                                  adjustHeight(e.target);
                                }}
                                onFocus={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                onKeyUp={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                onPaste={(e) => setTimeout(() => adjustHeight(e.target as HTMLTextAreaElement), 0)}
                                className={`${multilineInputClass} flex-grow`}
                              />
                              <button
                                onClick={() => removePoint('negatives', index)}
                                className={`p-2 h-8 flex items-center justify-center ${
                                  isDarkMode
                                    ? 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                    : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                } print:hidden flex-shrink-0`}
                                title="Remove negative"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {formData.negatives.filter(p => p.visible).length < 5 && (
                            <button
                              onClick={() => addPoint('negatives')}
                              className={`w-full p-2 mt-2 rounded-md text-sm border border-dashed print:hidden
                                ${isDarkMode 
                                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                                  : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                                }`}
                            >
                              + Add Negative
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>

        {/* Semi-transparent overlay for mobile */}
        {isChatVisible && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsChatVisible(false)}
          ></div>
        )}

        {/* Chat Interface - Modified for responsive design */}
        <div 
          className={`
            ${isChatVisible ? 'fixed right-0 top-0 bottom-0 w-full max-w-[90%] sm:w-80 md:w-96 md:relative' : 'hidden md:flex'} 
            md:w-96 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} 
            flex flex-col print:hidden
            ${isChatVisible ? `${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} md:bg-transparent z-50 shadow-2xl md:shadow-none` : ''}
            transition-all duration-300 ease-in-out h-full
          `}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-200'} flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <Bot className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Analysis Assistant</h3>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsChatVisible(false)}
              className="md:hidden"
            >
              <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'chat-message text-gray-100'
                        : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isDarkMode
                    ? 'chat-message text-gray-100'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}></div>
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce [animation-delay:0.2s]`}></div>
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce [animation-delay:0.4s]`}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask for help analyzing..."
                className={`flex-1 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500'
                    : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-blue-500'
                }`}
              />
              <button
                type="submit"
                className={`p-2 rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
                disabled={!currentMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
        
        {/* Floating chat button for mobile - appears when chat is hidden */}
        {!isChatVisible && (
          <button
            onClick={() => setIsChatVisible(true)}
            className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg md:hidden z-10 ${
              isDarkMode
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Bot className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
}

function Section({ title, children, isExpanded, onToggle, isDarkMode }: SectionProps) {
  return (
    <div className={`mb-8 rounded-xl overflow-hidden transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100 border border-gray-700 shadow-md shadow-gray-950/50' 
        : 'bg-white text-gray-900 border border-gray-300 shadow-md shadow-gray-200/70'
    } hover:shadow-lg transform hover:-translate-y-0.5 transition-all`}>
      <div 
        className={`flex justify-between items-center p-5 cursor-pointer ${
          isDarkMode 
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
        <div className={`p-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} print:px-2 print:py-1`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default App;