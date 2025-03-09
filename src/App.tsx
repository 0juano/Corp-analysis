import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ChevronUp, ChevronDown, X, Search, Printer, Send, Bot, Cpu, Plus, Link as LinkIcon } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

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
}

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCyberpunk, setIsCyberpunk] = useState(false);
  const [isin, setIsin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [showSourceInput, setShowSourceInput] = useState(false);
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
    analysis: true
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

  const handleAddSource = () => {
    if (newSourceUrl && newSourceUrl.startsWith('http')) {
      const newSource: Source = {
        id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: newSourceUrl,
        timestamp: Date.now()
      };
      setSources(prevSources => [...prevSources, newSource]);
      setNewSourceUrl('');
      setShowSourceInput(false);
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

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm a placeholder response. In the future, I'll help you analyze companies and fill out this form!",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsChatLoading(false);
    }, 1000);
  };

  const handlePrint = () => {
    const allExpanded = Object.keys(expandedSections).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setExpandedSections(allExpanded);
    
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleIsinSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isin.length === 12) {
      setIsSearching(true);
      setCompanyName('');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCompanyName('Sample Company Name Ltd.');
      setIsSearching(false);
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
  };

  const addDevelopment = () => {
    const developments = [...formData.developments];
    const nextIndex = developments.findIndex(d => !d.visible);
    if (nextIndex !== -1) {
      developments[nextIndex] = { emoji: 'up', text: '', visible: true };
      setFormData(prev => ({ ...prev, developments }));
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
    if (isCyberpunk) setIsCyberpunk(false);
  };

  const toggleCyberpunk = () => {
    setIsCyberpunk(!isCyberpunk);
    if (!isCyberpunk) setIsDarkMode(true);
  };

  const inputClass = `rounded-md border ${
    isCyberpunk
      ? 'bg-black bg-opacity-70 border-[#00ff9d] text-[#00ff9d] focus:ring-[#00ff9d] focus:border-[#00ff9d]'
      : isDarkMode
        ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500'
        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
  } focus:outline-none focus:ring-2 w-full`;

  const textareaClass = `${inputClass} min-h-[100px] resize-none w-full`;
  
  const multilineInputClass = `${inputClass} min-h-[60px] resize-none`;

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '32px';
    const scrollHeight = element.scrollHeight;
    if (scrollHeight > 32) {
      element.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  };

  const visibleDevelopments = formData.developments.filter(d => d.visible);
  const canAddDevelopment = visibleDevelopments.length < 5;

  return (
    <div className={`min-h-screen ${isCyberpunk ? 'cyberpunk' : isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row h-screen relative">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-0">
          <div className="container mx-auto px-4 py-8 max-w-4xl print:px-2 print:py-1">
            <div className="mb-8 print:mb-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    value={isin}
                    onChange={(e) => setIsin(e.target.value.toUpperCase())}
                    onKeyDown={handleIsinSubmit}
                    placeholder="Enter ISIN"
                    className={`${inputClass} py-1 px-2 w-44 text-lg font-mono uppercase ${isCyberpunk ? 'neon-border' : ''}`}
                    maxLength={12}
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Search className={`h-5 w-5 ${isCyberpunk ? 'text-[#00ff9d]' : 'text-blue-500'} ${isCyberpunk ? 'glitch' : 'animate-spin'}`} />
                    </div>
                  )}
                </div>
                {(isSearching || companyName) && (
                  <div className={`${isCyberpunk ? 'neon-text' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex-grow ${isCyberpunk ? 'glitch' : ''}`}>
                    {isSearching ? (
                      <span className="animate-pulse text-lg">Searching...</span>
                    ) : (
                      <h2 className="text-2xl font-bold">{companyName}</h2>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden ${
                      isCyberpunk ? 'text-[#00ff9d]' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    title="Print report"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleCyberpunk}
                    className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden ${
                      isCyberpunk ? 'text-[#00ff9d]' : 'text-purple-500'
                    }`}
                    title={isCyberpunk ? "Disable Cyberpunk mode" : "Enable Cyberpunk mode"}
                  >
                    <Cpu className={`h-5 w-5 ${isCyberpunk ? 'glitch' : ''}`} />
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden"
                  >
                    {isDarkMode ? (
                      <Sun className={`h-5 w-5 ${isCyberpunk ? 'text-[#00ff9d]' : 'text-yellow-500'}`} />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {/* Chat toggle button for mobile */}
                  <button
                    onClick={() => setIsChatVisible(!isChatVisible)}
                    className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 print:hidden md:hidden ${
                      isCyberpunk ? 'text-[#00ff9d]' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    title={isChatVisible ? "Hide chat" : "Show chat"}
                  >
                    <Bot className={`h-5 w-5 ${isCyberpunk ? 'glitch' : ''}`} />
                  </button>
                </div>
              </div>
              {isin && isin.length !== 12 && (
                <p className="mt-1 text-sm text-amber-500">
                  ISIN must be exactly 12 characters
                </p>
              )}
            </div>

            <div className="space-y-4 print:space-y-1">
              <Section
                title="Business Overview"
                isExpanded={expandedSections.business}
                onToggle={() => toggleSection('business')}
                isDarkMode={isDarkMode}
                isCyberpunk={isCyberpunk}
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
                    {sources.map((source) => (
                      <div key={source.id} className="relative group">
                        <div className="flex items-center gap-1">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-2 py-1 rounded-full ${
                              isCyberpunk
                                ? 'bg-[#00ff9d] bg-opacity-20 text-[#00ff9d] hover:bg-opacity-30'
                                : isDarkMode
                                  ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                                  : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                            } flex items-center gap-1`}
                          >
                            <LinkIcon className="h-3 w-3" />
                            <span className="truncate max-w-[100px] sm:max-w-[150px]">
                              {linkPreviews[source.url]?.title || new URL(source.url).hostname}
                            </span>
                          </a>
                          <button
                            onClick={() => handleRemoveSource(source.id)}
                            className={`p-1 rounded-full ${
                              isCyberpunk
                                ? 'text-red-400 hover:text-red-300'
                                : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                            } opacity-0 group-hover:opacity-100 transition-opacity print:hidden`}
                            title="Remove source"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div
                          data-tooltip-id={`source-preview-${source.id}`}
                          data-tooltip-content="Loading preview..."
                          className="absolute bottom-0 left-0"
                        ></div>
                        <Tooltip
                          id={`source-preview-${source.id}`}
                          place="bottom"
                          className={`max-w-xs ${isCyberpunk ? 'cyberpunk-tooltip' : ''}`}
                        >
                          {linkPreviews[source.url] ? (
                            <div className="p-2">
                              <div className="font-bold mb-1">{linkPreviews[source.url].title}</div>
                              <div className="text-sm">{linkPreviews[source.url].description}</div>
                            </div>
                          ) : (
                            "Loading preview..."
                          )}
                        </Tooltip>
                      </div>
                    ))}
                    {showSourceInput ? (
                      <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                        <input
                          type="text"
                          value={newSourceUrl}
                          onChange={(e) => setNewSourceUrl(e.target.value)}
                          placeholder="Enter URL"
                          className={`${inputClass} py-1 px-2 text-sm w-full sm:w-auto`}
                        />
                        <div className="flex gap-1 mt-1 sm:mt-0">
                          <button
                            onClick={handleAddSource}
                            className={`px-2 py-1 rounded-md text-xs ${
                              isCyberpunk
                                ? 'bg-[#00ff9d] bg-opacity-20 text-[#00ff9d] hover:bg-opacity-30'
                                : isDarkMode
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowSourceInput(false);
                              setNewSourceUrl('');
                            }}
                            className={`px-2 py-1 rounded-md text-xs ${
                              isCyberpunk
                                ? 'bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSourceInput(true)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isCyberpunk
                            ? 'bg-[#00ff9d] bg-opacity-20 text-[#00ff9d] hover:bg-opacity-30'
                            : isDarkMode
                              ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                              : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
                        } flex items-center gap-1 print:hidden`}
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Source</span>
                      </button>
                    )}
                  </div>
                </div>
              </Section>

              <Section
                title="Ownership & Management"
                isExpanded={expandedSections.ownership}
                onToggle={() => toggleSection('ownership')}
                isDarkMode={isDarkMode}
                isCyberpunk={isCyberpunk}
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
              </Section>

              <Section
                title="Industry & Competition"
                isExpanded={expandedSections.industry}
                onToggle={() => toggleSection('industry')}
                isDarkMode={isDarkMode}
                isCyberpunk={isCyberpunk}
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
              </Section>

              <Section
                title="Latest Earnings & Financial Snapshot"
                isExpanded={expandedSections.earnings}
                onToggle={() => toggleSection('earnings')}
                isDarkMode={isDarkMode}
                isCyberpunk={isCyberpunk}
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
              </Section>

              <Section
                title="Key Developments"
                isExpanded={expandedSections.developments}
                onToggle={() => toggleSection('developments')}
                isDarkMode={isDarkMode}
                isCyberpunk={isCyberpunk}
              >
                <div className="space-y-3">
                  {formData.developments.filter(d => d.visible).map((development, index) => (
                    <div key={`development-${index}`} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-2">
                        <button
                          onClick={() => handleDevelopmentChange(index, 'emoji', development.emoji === 'up' ? 'down' : 'up')}
                          className={`p-1 rounded-md ${
                            development.emoji === 'up'
                              ? isCyberpunk
                                ? 'text-[#00ff9d]'
                                : 'text-green-500 dark:text-green-400'
                              : isCyberpunk
                                ? 'text-red-400'
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
                          onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                          className={`${multilineInputClass} flex-grow`}
                        />
                      </div>
                      <button
                        onClick={() => removeDevelopment(index)}
                        className={`p-2 h-8 flex items-center justify-center ${
                          isCyberpunk
                            ? 'text-red-400 hover:text-red-300'
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
                        ${isCyberpunk 
                          ? 'border-[#00ff9d] text-[#00ff9d] hover:border-[#00ff9d] hover:text-[#00ff9d]' 
                          : isDarkMode 
                            ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                            : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                        }`}
                    >
                      + Add Development
                    </button>
                  )}
                </div>
              </Section>

              <Section
                title="Analysis"
                isExpanded={expandedSections.analysis}
                onToggle={() => toggleSection('analysis')}
                isDarkMode={isDarkMode}
                isCyberpunk={isCyberpunk}
              >
                <div className="space-y-4">
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${
                          isCyberpunk 
                            ? 'text-[#00ff9d]' 
                            : isDarkMode 
                              ? 'text-gray-300' 
                              : 'text-gray-700'
                        }`}>
                          Positives
                        </h4>
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
                                onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                className={`${multilineInputClass} flex-grow`}
                              />
                              <button
                                onClick={() => removePoint('positives', index)}
                                className={`p-2 h-8 flex items-center justify-center ${
                                  isCyberpunk
                                    ? 'text-red-400 hover:text-red-300'
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
                                ${isCyberpunk 
                                  ? 'border-[#00ff9d] text-[#00ff9d] hover:border-[#00ff9d] hover:text-[#00ff9d]' 
                                  : isDarkMode 
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
                        <h4 className={`font-medium mb-2 ${
                          isCyberpunk 
                            ? 'text-[#00ff9d]' 
                            : isDarkMode 
                              ? 'text-gray-300' 
                              : 'text-gray-700'
                        }`}>
                          Negatives
                        </h4>
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
                                onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                                className={`${multilineInputClass} flex-grow`}
                              />
                              <button
                                onClick={() => removePoint('negatives', index)}
                                className={`p-2 h-8 flex items-center justify-center ${
                                  isCyberpunk
                                    ? 'text-red-400 hover:text-red-300'
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
                                ${isCyberpunk 
                                  ? 'border-[#00ff9d] text-[#00ff9d] hover:border-[#00ff9d] hover:text-[#00ff9d]' 
                                  : isDarkMode 
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
            md:w-96 border-l ${isCyberpunk ? 'border-[#00ff9d] chat-container' : 'border-gray-700'} 
            flex flex-col print:hidden
            ${isChatVisible ? 'bg-gray-900 md:bg-transparent z-50 shadow-2xl md:shadow-none' : ''}
            transition-all duration-300 ease-in-out h-full
          `}
        >
          <div className={`p-4 border-b ${isCyberpunk ? 'border-[#00ff9d] bg-opacity-30' : 'border-gray-700 bg-gray-800'} flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <Bot className={`h-5 w-5 ${isCyberpunk ? 'text-[#00ff9d]' : 'text-blue-400'}`} />
              <h3 className={`text-lg font-semibold ${isCyberpunk ? 'neon-text' : 'text-white'}`}>Analysis Assistant</h3>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsChatVisible(false)}
              className="md:hidden"
            >
              <X className={`h-5 w-5 ${isCyberpunk ? 'text-[#00ff9d]' : 'text-gray-300'}`} />
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
                      ? isCyberpunk
                        ? 'bg-[#00ff9d] bg-opacity-20 text-[#00ff9d] neon-border'
                        : 'bg-blue-600 text-white'
                      : isCyberpunk
                        ? 'chat-message text-[#00ff9d]'
                        : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isCyberpunk
                    ? 'chat-message text-[#00ff9d]'
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 ${isCyberpunk ? 'bg-[#00ff9d]' : 'bg-gray-400'} rounded-full animate-bounce`}></div>
                    <div className={`w-2 h-2 ${isCyberpunk ? 'bg-[#00ff9d]' : 'bg-gray-400'} rounded-full animate-bounce [animation-delay:0.2s]`}></div>
                    <div className={`w-2 h-2 ${isCyberpunk ? 'bg-[#00ff9d]' : 'bg-gray-400'} rounded-full animate-bounce [animation-delay:0.4s]`}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className={`p-4 border-t ${isCyberpunk ? 'border-[#00ff9d] bg-opacity-30' : 'border-gray-700 bg-gray-800'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask for help analyzing..."
                className={`flex-1 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  isCyberpunk
                    ? 'bg-opacity-10 text-[#00ff9d] placeholder-[#00ff9d] placeholder-opacity-50 focus:ring-[#00ff9d]'
                    : 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500'
                }`}
              />
              <button
                type="submit"
                className={`p-2 rounded-md focus:outline-none focus:ring-2 ${
                  isCyberpunk
                    ? 'bg-[#00ff9d] bg-opacity-20 text-[#00ff9d] hover:bg-opacity-30 focus:ring-[#00ff9d]'
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
              isCyberpunk
                ? 'bg-[#00ff9d] bg-opacity-20 text-[#00ff9d] hover:bg-opacity-30 neon-border'
                : isDarkMode
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
  isCyberpunk: boolean;
}

function Section({ title, children, isExpanded, onToggle, isDarkMode, isCyberpunk }: SectionProps) {
  return (
    <div className={`border rounded-lg ${
      isCyberpunk 
        ? 'section-card' 
        : isDarkMode 
          ? 'border-gray-700 bg-gray-800' 
          : 'border-gray-200 bg-white'
    }`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex justify-between items-center"
      >
        <h2 className={`font-semibold ${
          isCyberpunk 
            ? 'neon-text' 
            : isDarkMode 
              ? 'text-white' 
              : 'text-gray-900'
        }`}>{title}</h2>
        {isExpanded ? (
          <ChevronUp className={`h-5 w-5 ${
            isCyberpunk 
              ? 'text-[#00ff9d]' 
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-500'
          } print:hidden`} />
        ) : (
          <ChevronDown className={`h-5 w-5 ${
            isCyberpunk 
              ? 'text-[#00ff9d]' 
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-500'
          } print:hidden`} />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 print:px-2 print:py-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default App;