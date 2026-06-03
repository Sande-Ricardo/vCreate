'use client';

import { useState, useEffect } from 'react';
import { useCvStore } from '@/store/cv.store';
import { Button, Input } from '@/components/ui';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { data, setNotification } = useCvStore();
  const [format, setFormat] = useState<'pdf_only' | 'zip_single_language_json' | 'zip_all_languages' | 'zip_all_languages_json'>('pdf_only');
  const [apiKey, setApiKey] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key from local storage on mount
  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('vcreate_deepl_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    
    // Save API key to local storage if provided
    if (apiKey) {
      localStorage.setItem('vcreate_deepl_api_key', apiKey.trim());
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data, 
          format,
          apiKey: apiKey.trim() || undefined
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Error compilando el documento LaTeX (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'vCreate_Export.zip';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) filename = match[1];
      } else if (format === 'pdf_only') {
        filename = 'vCreate_CV.pdf';
      }

      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setNotification({
        message: 'CV exported successfully.',
        type: 'success',
      });
      onClose();
    } catch (e: any) {
      setError(e.message);
      setNotification({
        message: e.message,
        type: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const RadioOption = ({ value, label, description }: { value: string; label: string; description?: string }) => (
    <label className={`flex items-start gap-3 p-3 cursor-pointer transition-colors border ${format === value ? 'border-white bg-[rgba(255,255,255,0.05)]' : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'}`}>
      <input 
        type="radio" 
        name="format" 
        value={value} 
        checked={format === value} 
        onChange={() => setFormat(value as any)} 
        className="accent-white mt-1"
      />
      <div className="flex flex-col">
        <span className="text-white font-medium">{label}</span>
        {description && <span className="text-[var(--color-on-surface-variant)] type-body-sm mt-1">{description}</span>}
      </div>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="surface-elevated w-full max-w-lg p-6 border border-[rgba(255,255,255,0.1)] glow-sm relative my-auto">
        <h2 className="type-title-md mb-2 text-white">Export Console</h2>
        <p className="type-body-md text-[var(--color-on-surface-variant)] mb-6">
          Selecciona el formato de exportación deseado. El documento será compilado en tiempo real utilizando LaTeX.
        </p>
        
        <div className="space-y-3 mb-6">
          <RadioOption 
            value="pdf_only" 
            label="Solo CV en formato PDF" 
            description="Descarga un único archivo PDF en el idioma actual."
          />
          <RadioOption 
            value="zip_single_language_json" 
            label="PDF + JSON (.zip)" 
            description="Descarga el PDF y el archivo de respaldo JSON en un archivo comprimido."
          />
          <RadioOption 
            value="zip_all_languages" 
            label="Ambos CV (Español/Inglés) (.zip)" 
            description="Traduce automáticamente y compila ambas versiones del currículum."
          />
          <RadioOption 
            value="zip_all_languages_json" 
            label="Ambos CV + JSON (.zip)" 
            description="El paquete completo: CV en ambos idiomas y el respaldo JSON de los datos."
          />
        </div>

        {(format === 'zip_all_languages' || format === 'zip_all_languages_json') && (
          <div className="mb-6 p-4 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
            <h3 className="text-white font-medium mb-2">DeepL API Key</h3>
            <p className="type-body-sm text-[var(--color-on-surface-variant)] mb-3">
              La generación bilingüe requiere una API Key de DeepL. Puedes ingresarla aquí o configurarla en tu archivo <code>.env.local</code> del servidor.
            </p>
            <Input 
              type="password" 
              placeholder="DeepL-Auth-Key..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}

        {error && (
          <div className="p-3 mb-6 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] type-body-md border border-[var(--color-error)]">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1 justify-center" onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          <Button variant="primary" className="flex-1 justify-center" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Procesando...' : 'Descargar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
