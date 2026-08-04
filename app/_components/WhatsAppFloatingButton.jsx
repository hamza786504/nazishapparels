'use client';

import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../store/siteSettingsContext';
import Image from 'next/image';
import { X, Send } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const settings = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const whatsappSettings = settings?.adapters?.whatsapp || {};

  // Forcing render for debugging
  // if (!whatsappSettings || !whatsappSettings.enabled) {
  //  return null;
  // }

  const popupRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      if (isOpen) {
        // If the scrolling happens inside the popup itself, don't close it
        if (popupRef.current && popupRef.current.contains(e.target)) {
          return;
        }
        // Otherwise, close the popup
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    }

    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [isOpen]);

  const positionClass = whatsappSettings.position === 'bottom-left'
    ? 'left-4 md:bottom-2 bottom-16'
    : 'right-4 md:bottom-2 bottom-16';

  const presets = whatsappSettings.presets || [];
  
  const handleChat = (presetMessage = '') => {
    const phoneNumber = whatsappSettings.phoneNumber;
    
    let textMessage = presetMessage;
    
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      if (textMessage) {
        textMessage += `\n\nPage Link: ${currentUrl}`;
      } else if (currentUrl.includes('/product/')) {
        textMessage = `Hello, I'm inquiring about this product:\n${currentUrl}`;
      }
    }
    
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, '_blank');
    setIsOpen(false);
    setCustomMessage('');
  };

  return (
    <div className={`fixed z-[999999] ${positionClass} flex flex-col items-end`}>
      {/* Popup Menu */}
      {isOpen && (
        <div 
          ref={popupRef}
          className={`mb-3 bg-white rounded shadow-lg border border-gray-100 overflow-hidden w-72 transition-all duration-300 ease-in-out ${whatsappSettings.position === 'bottom-left' ? 'origin-bottom-left' : 'origin-bottom-right'}`}
        >
          <div className="bg-[#25D366] px-3 py-2 text-white flex justify-between items-start">
            <div>
              <h4 className="font-bold text-sm">Chat with us</h4>
              <p className="text-[10px] opacity-90 leading-tight">Usually replies in a few minutes</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-3 max-h-64 overflow-y-auto flex flex-col gap-3">
            {presets.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 ml-1">Select a preset:</p>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChat(preset)}
                    className="w-full text-left px-2 py-1.5 rounded bg-gray-50 hover:bg-green-50 hover:text-green-700 transition-colors text-xs border border-transparent hover:border-green-200"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 ml-1">Or write your own:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customMessage.trim()) {
                      handleChat(customMessage);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customMessage.trim()) {
                      handleChat(customMessage);
                    }
                  }}
                  className="p-1.5 bg-[#25D366] text-white rounded hover:bg-[#20bd5a] transition-colors flex-shrink-0"
                  disabled={!customMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whatsapp-float bg-[#25D366] hover:bg-[#20bd5a] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp" 
          width={24} 
          height={24} 
          className="w-7 h-7 filter drop-shadow-sm"
        />
      </button>
    </div>
  );
}
