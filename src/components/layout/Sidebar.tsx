'use client';

import { useRef, useState } from 'react';
import { useCvStore, type CvState } from '@/store/cv.store';
import { i18n } from '@/lib/i18n';
import { Button } from '@/components/ui';
import { ExportModal } from '@/components/layout/ExportModal';

type SectionId = CvState['activeSection'];

const SECTIONS: { id: SectionId; i18nKey: keyof typeof i18n['en'] }[] = [
  { id: 'personal_data', i18nKey: 'personalData' },
  { id: 'work_experience', i18nKey: 'workExperience' },
  { id: 'projects', i18nKey: 'projects' },
  { id: 'education', i18nKey: 'education' },
  { id: 'certifications', i18nKey: 'certifications' },
  { id: 'technical_skills', i18nKey: 'technicalSkills' },
  { id: 'soft_skills_languages', i18nKey: 'softSkills' }, // Display as soft skills & languages
];

export function Sidebar() {
  const { data, activeSection, setActiveSection, loadFromJson } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vcreate_cv_draft.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <aside className="w-full lg:w-56 shrink-0 border-r border-[rgba(229,229,229,0.1)] p-6 bg-[rgba(255,255,255,0.01)] backdrop-blur-md overflow-y-auto">
      <h2 className="type-title-md mb-6">{labels.navigation}</h2>
      <nav className="flex flex-col gap-2">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          // Special label for combined section
          const label = section.id === 'soft_skills_languages' 
            ? `${labels.softSkills} & ${labels.languages}`
            : labels[section.i18nKey];

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={[
                'type-body-md text-left p-2 transition-all duration-150',
                isActive
                  ? 'bg-[rgba(255,255,255,0.1)] text-white font-medium border-l-2 border-white'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-on-surface)] border-l-2 border-transparent',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-[rgba(255,255,255,0.05)] pt-6 space-y-3">
        <h3 className="type-label-caps text-[var(--color-outline)] mb-3">Draft Tools</h3>
        
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImportJson} 
        />
        
        <Button 
          variant="secondary" 
          className="w-full justify-center" 
          onClick={() => fileInputRef.current?.click()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Import JSON
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full justify-center" 
          onClick={handleExportJson}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export JSON
        </Button>
      </div>

      <div className="mt-4">
        <Button 
          variant="primary" 
          className="w-full justify-center py-3 text-[var(--color-surface)] glow-md" 
          onClick={() => setIsExportModalOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Generate PDF
        </Button>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </aside>
  );
}
