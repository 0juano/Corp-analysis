import { useState, useRef, useEffect } from 'react';
import { Message, Source, LinkPreview } from '../types';

/**
 * Custom hook for managing chat functionality
 * 
 * @returns Chat state and handlers
 */
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [showSourceInput, setShowSourceInput] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [linkPreviews, setLinkPreviews] = useState<Record<string, LinkPreview>>({});
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to the bottom of the chat when messages change
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Source handlers
  const sourceHandlers = useSourceHandlers(sources, setSources, newSourceUrl, setNewSourceUrl, 
    showSourceInput, setShowSourceInput, setLinkPreviews);
  
  // Message handlers
  const messageHandlers = useMessageHandlers(messages, setMessages, currentMessage, 
    setCurrentMessage, isChatLoading, setIsChatLoading);
  
  /**
   * Toggle chat visibility
   */
  const toggleChatVisibility = () => {
    setIsChatVisible(prev => !prev);
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    isChatLoading,
    sources,
    showSourceInput,
    setShowSourceInput,
    newSourceUrl,
    setNewSourceUrl,
    linkPreviews,
    chatEndRef,
    isChatVisible,
    ...sourceHandlers,
    ...messageHandlers,
    toggleChatVisibility
  };
};

/**
 * Custom hook for managing sources
 * 
 * @param sources - The sources state
 * @param setSources - Function to update sources
 * @param newSourceUrl - The new source URL
 * @param setNewSourceUrl - Function to update new source URL
 * @param showSourceInput - Whether to show source input
 * @param setShowSourceInput - Function to update show source input
 * @param setLinkPreviews - Function to update link previews
 * @returns Source handlers
 */
const useSourceHandlers = (
  sources: Source[],
  setSources: React.Dispatch<React.SetStateAction<Source[]>>,
  newSourceUrl: string,
  setNewSourceUrl: React.Dispatch<React.SetStateAction<string>>,
  showSourceInput: boolean,
  setShowSourceInput: React.Dispatch<React.SetStateAction<boolean>>,
  setLinkPreviews: React.Dispatch<React.SetStateAction<Record<string, LinkPreview>>>
) => {
  /**
   * Fetch link preview for a URL
   * 
   * @param url - The URL to fetch preview for
   */
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

  /**
   * Add a source URL
   */
  const handleAddSource = () => {
    if (newSourceUrl && newSourceUrl.startsWith('http')) {
      const newSource: Source = {
        id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: newSourceUrl,
        timestamp: Date.now()
      };
      setSources(prev => [...prev, newSource]);
      setNewSourceUrl('');
      setShowSourceInput(false);
      fetchLinkPreview(newSourceUrl);
    }
  };

  /**
   * Remove a source
   * 
   * @param id - The ID of the source to remove
   */
  const handleRemoveSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
  };

  return { handleAddSource, handleRemoveSource };
};

/**
 * Custom hook for managing messages
 * 
 * @param messages - The messages state
 * @param setMessages - Function to update messages
 * @param currentMessage - The current message
 * @param setCurrentMessage - Function to update current message
 * @param isChatLoading - Whether chat is loading
 * @param setIsChatLoading - Function to update chat loading state
 * @returns Message handlers
 */
const useMessageHandlers = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  currentMessage: string,
  setCurrentMessage: React.Dispatch<React.SetStateAction<string>>,
  isChatLoading: boolean,
  setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  /**
   * Send a chat message
   * 
   * @param e - The form event
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: `I've analyzed your request: "${currentMessage}". How can I assist you further with your corporate analysis?`,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsChatLoading(false);
    }, 1500);
  };

  return { handleSendMessage };
}; 