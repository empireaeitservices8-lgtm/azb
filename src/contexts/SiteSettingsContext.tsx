'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/siteSettings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  isLoading: false,
  refreshSettings: async () => {}
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error('Error fetching site settings from /api/settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SITE_SETTINGS,
      isLoading: false,
      refreshSettings: async () => {}
    };
  }
  return context;
}
