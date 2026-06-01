'use client';

import { useCvStore } from '@/store/cv.store';
import { Button } from '@/components/ui';

export function LanguageSelector() {
  const { isInitialized, setInputLanguage } = useCvStore();

  if (isInitialized) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="surface-elevated p-8 max-w-md w-full border border-[rgba(229,229,229,0.15)] flex flex-col items-center text-center gap-6">
        <div>
          <h2 className="type-headline-lg-mobile text-white mb-2">Welcome to vCreate</h2>
          <p className="type-body-md text-[var(--color-on-surface-variant)]">
            Choose your input language. This will configure the forms and CV preview.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full mt-4">
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={() => setInputLanguage('en')}
          >
            Create in English
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            fullWidth 
            onClick={() => setInputLanguage('es')}
          >
            Crear en Español
          </Button>
        </div>
      </div>
    </div>
  );
}
