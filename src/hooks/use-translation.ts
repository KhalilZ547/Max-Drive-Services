'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import type { TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || translations['en'][key];
    },
    [language]
  );

  return { t };
}
