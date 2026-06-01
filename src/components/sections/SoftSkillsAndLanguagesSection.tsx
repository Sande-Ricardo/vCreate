'use client';

import { useCvStore } from '@/store/cv.store';
import { i18n } from '@/lib/i18n';
import { Input, Card, Button, ArrayInput } from '@/components/ui';

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M6 4V2h4v2M5 4v10h6V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function SoftSkillsAndLanguagesSection() {
  const { data, setSoftSkills, addLanguage, updateLanguage, removeLanguage } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

  const handleAddLanguage = () => {
    addLanguage({
      language: '',
      proficiency: ''
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Soft Skills Section */}
      <section className="space-y-6">
        <h1 className="type-headline-lg">{labels.softSkills}</h1>
        <Card withNode={false}>
          <ArrayInput
            label={labels.softSkills}
            items={data.soft_skills}
            onChange={(items) => setSoftSkills(items)}
            placeholder="Leadership, Communication, Agile..."
            buttonLabel={labels.add}
          />
        </Card>
      </section>

      {/* Languages Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="type-headline-lg">{labels.languages}</h1>
          <Button variant="primary" size="md" onClick={handleAddLanguage}>
            + {labels.add}
          </Button>
        </div>

        <div className="space-y-4">
          {data.languages.map((langItem, index) => (
            <Card key={index} className="!p-4 flex gap-4 items-start" withNode={false}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <Input
                  label={labels.languageName}
                  value={langItem.language}
                  onChange={(e) => updateLanguage(index, { language: e.target.value })}
                  placeholder="English"
                />
                <Input
                  label={labels.proficiency}
                  value={langItem.proficiency}
                  onChange={(e) => updateLanguage(index, { proficiency: e.target.value })}
                  placeholder="Native"
                />
              </div>
              <button 
                onClick={() => removeLanguage(index)}
                className="mt-7 p-2 hover:bg-[rgba(255,180,171,0.1)] transition-colors text-[var(--color-outline)] hover:text-[var(--color-error)]"
                title={labels.remove}
              >
                <IconTrash />
              </button>
            </Card>
          ))}
          
          {data.languages.length === 0 && (
            <div className="text-center p-8 border border-dashed border-[rgba(229,229,229,0.1)] surface-glass">
              <p className="type-body-md text-[var(--color-on-surface-variant)]">
                No languages added yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
