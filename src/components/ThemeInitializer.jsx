'use client';

import { useEffect } from 'react';
import localforage from 'localforage';

export default function ThemeInitializer() {
  useEffect(() => {
    const applyTheme = async () => {
      const savedTheme = await localforage.getItem('theme');
      const isDark = savedTheme === 'dark';

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
  }, []);

  return null;
}
