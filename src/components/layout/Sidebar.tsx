'use client';

import { useCvStore, type CvState } from '@/store/cv.store';
import { i18n } from '@/lib/i18n';

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
  const { data, activeSection, setActiveSection } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

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
    </aside>
  );
}
