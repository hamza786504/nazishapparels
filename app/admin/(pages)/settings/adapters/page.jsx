'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Check, Smartphone, MessageCircle, Plus, Trash2, Search, X } from 'lucide-react';
import Button from '../../../../_components/Admin/Button';

// Mock list of adapters we could have. Right now only WhatsApp is fully implemented.
const ADAPTER_DEFINITIONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Chat',
    description: 'Display a floating WhatsApp button on the frontend.',
    icon: MessageCircle,
    color: 'text-[#25D366]',
    bg: 'bg-[#25D366]/10'
  },
  // We can add more adapters here in the future
];

export default function AdaptersSettingsPage() {
  const [formData, setFormData] = useState({
    adapters: {
      whatsapp: {
        enabled: false,
        phoneNumber: '',
        position: 'bottom-right',
        presets: [],
      }
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [newPreset, setNewPreset] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdapter, setSelectedAdapter] = useState(null); // 'whatsapp' etc.

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings/general', { credentials: 'include' });
        const result = await res.json();
        if (result.success && result.settings) {
          const adapters = result.settings.adapters || {
            whatsapp: {
              enabled: false,
              phoneNumber: '',
              position: 'bottom-right',
              presets: [],
            }
          };
          setFormData({ adapters });
        }
      } catch (error) {
        console.error('Error loading adapters settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const res = await fetch('/api/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adapters: formData.adapters }),
        credentials: 'include',
      });
      const result = await res.json();
      if (result.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('idle');
        alert(result.error || 'Failed to save adapters');
      }
    } catch (error) {
      console.error('Error saving adapters:', error);
      setSaveStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  const updateAdapterField = (adapterId, key, value) => {
    setFormData(prev => ({
      ...prev,
      adapters: {
        ...prev.adapters,
        [adapterId]: {
          ...prev.adapters[adapterId],
          [key]: value
        }
      }
    }));
  };

  const addPreset = (adapterId) => {
    if (!newPreset.trim()) return;
    const presets = formData.adapters[adapterId]?.presets || [];
    updateAdapterField(adapterId, 'presets', [...presets, newPreset.trim()]);
    setNewPreset('');
  };

  const removePreset = (adapterId, index) => {
    const presets = formData.adapters[adapterId]?.presets || [];
    updateAdapterField(adapterId, 'presets', presets.filter((_, i) => i !== index));
  };

  const filteredAdapters = ADAPTER_DEFINITIONS.filter(adapter => 
    adapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adapter.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-0 md:p-8 min-h-screen">
      <div className="max-w-[1200px] mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">
              Adapters
            </h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              Connect and manage third-party integrations for your storefront.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              icon={
                (saveStatus === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />) ||
                (saveStatus === 'saved' && <Check className="w-4 h-4" />)
              }
            >
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'Saved!'}
              {saveStatus === 'idle' && 'Save changes'}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              placeholder="Search adapters..."
              className="w-full pl-10 pr-4 py-2 text-body-md border border-[#C9CCCF] rounded focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-body-md text-on-surface-variant mb-6">Loading adapters…</div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdapters.map((adapter) => {
                const Icon = adapter.icon;
                const isEnabled = formData.adapters[adapter.id]?.enabled;
                
                return (
                  <div 
                    key={adapter.id}
                    onClick={() => setSelectedAdapter(adapter.id)}
                    className="bg-white border border-[#E1E3E5] rounded-xl p-5 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${adapter.bg} ${adapter.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm mb-2 group-hover:text-primary transition-colors">{adapter.name}</h3>
                    <p className="text-body-sm text-on-surface-variant flex-grow">
                      {adapter.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {filteredAdapters.length === 0 && (
              <div className="p-8 text-center bg-surface-container-low rounded border border-[#C9CCCF]">
                <p className="text-body-md text-on-surface-variant">No adapters found matching "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}

        {/* Adapter Configuration Modal */}
        {selectedAdapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E1E3E5] bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  {(() => {
                    const adapter = ADAPTER_DEFINITIONS.find(a => a.id === selectedAdapter);
                    const Icon = adapter?.icon || MessageCircle;
                    return (
                      <>
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${adapter?.bg} ${adapter?.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-headline-sm font-bold text-on-surface">
                          {adapter?.name} Configuration
                        </h2>
                      </>
                    );
                  })()}
                </div>
                <button 
                  onClick={() => setSelectedAdapter(null)}
                  className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-grow space-y-6">
                {selectedAdapter === 'whatsapp' && (
                  <>
                    {/* Enable Toggle */}
                    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded border border-[#C9CCCF]">
                      <div>
                        <h4 className="font-label-md text-on-surface">Enable Widget</h4>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                          Show the WhatsApp button on the frontend.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.adapters.whatsapp.enabled}
                          onChange={(e) => updateAdapterField('whatsapp', 'enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Phone Number & Position Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label-md text-on-surface-variant mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 text-body-md border border-[#C9CCCF] rounded focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                            placeholder="e.g. 61430276266"
                            value={formData.adapters.whatsapp.phoneNumber}
                            onChange={(e) => updateAdapterField('whatsapp', 'phoneNumber', e.target.value)}
                          />
                        </div>
                        <p className="text-body-sm text-on-surface-variant mt-2 italic">
                          Include country code without '+' or '00'.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block font-label-md text-on-surface-variant mb-2">
                          Widget Position
                        </label>
                        <select
                          className="w-full px-3 py-2 text-body-md border border-[#C9CCCF] rounded focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all bg-white"
                          value={formData.adapters.whatsapp.position}
                          onChange={(e) => updateAdapterField('whatsapp', 'position', e.target.value)}
                        >
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                        </select>
                      </div>
                    </div>

                    {/* Preset Messages */}
                    <div className="pt-4 border-t border-[#E1E3E5]">
                      <label className="block font-label-md text-on-surface-variant mb-2">
                        Preset Messages
                      </label>
                      <p className="text-body-sm text-on-surface-variant mb-4">
                        Allow customers to quickly start a chat using predefined messages.
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        {(formData.adapters.whatsapp.presets || []).map((preset, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-surface-container-low border border-[#C9CCCF] rounded">
                            <span className="text-body-md text-on-surface">{preset}</span>
                            <button
                              type="button"
                              onClick={() => removePreset('whatsapp', idx)}
                              className="p-1 text-on-surface-variant hover:text-error transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.adapters.whatsapp.presets || formData.adapters.whatsapp.presets.length === 0) && (
                          <p className="text-body-sm text-on-surface-variant italic">No presets added yet.</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-body-md border border-[#C9CCCF] rounded focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                          placeholder="e.g. I need help with my order"
                          value={newPreset}
                          onChange={(e) => setNewPreset(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addPreset('whatsapp');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => addPreset('whatsapp')}
                          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 border-t border-[#E1E3E5] bg-surface-container-lowest flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAdapter(null)}
                  className="px-4 py-2 font-medium rounded hover:bg-surface-container-high transition-colors"
                >
                  Close
                </button>
                <Button
                  onClick={async () => {
                    await handleSave();
                    setSelectedAdapter(null);
                  }}
                  disabled={isSaving}
                  icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                >
                  {isSaving ? 'Saving...' : 'Save and Close'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
