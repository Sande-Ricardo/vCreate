'use client';

import { useState, useRef } from 'react';
import { useCvStore } from '@/store/cv.store';
import { Button } from '@/components/ui';
import { ExportModal } from './ExportModal';

export function ExportConsole() {
  const { data, loadFromJson, setNotification } = useCvStore();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        loadFromJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveDraft = () => {
    const updatedData = {
      ...data,
      metadata: {
        ...data.metadata,
        last_updated: new Date().toISOString(),
      },
    };
    const jsonStr = JSON.stringify(updatedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vcreate_cv_draft.json`;
    a.click();
    URL.revokeObjectURL(url);

    setNotification({
      message: 'Draft saved successfully.',
      type: 'success',
    });
  };

  const hasName = data.personal_data.full_name;
  const displayName = hasName 
    ? data.personal_data.full_name.trim() 
    : 'New CV Draft';

  return (
    <div className="w-full border-t border-[rgba(229,229,229,0.1)] bg-[#131313] p-4 flex flex-col sm:flex-row items-center justify-between sticky bottom-0 z-10 gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJson}
        accept=".json"
        className="hidden"
      />
      
      <div className="type-body-md text-[var(--color-on-surface-variant)] flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 shrink-0" />
        <span>Active Draft: <strong>{displayName}</strong></span>
      </div>

      <div className="flex flex-wrap gap-4 w-full sm:w-auto">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 sm:flex-initial justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Load JSON
        </Button>

        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 sm:flex-initial justify-center"
          onClick={handleSaveDraft}
        >
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save Draft
        </Button>

        <Button 
          variant="primary" 
          size="sm" 
          className="w-full sm:w-auto justify-center"
          onClick={() => setIsExportModalOpen(true)}
        >
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PDF/ZIP
        </Button>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </div>
  );
}
