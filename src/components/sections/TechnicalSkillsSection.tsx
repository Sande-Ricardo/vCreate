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

function IconChevronUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function TechnicalSkillsSection() {
  const { data, addTechnicalSkillCategory, updateTechnicalSkillCategory, removeTechnicalSkillCategory } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

  const handleAdd = () => {
    addTechnicalSkillCategory({
      category: '',
      skills: []
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.technical_skills.length - 1) return;
    
    const arr = [...data.technical_skills];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    const temp = arr[index];
    updateTechnicalSkillCategory(index, arr[targetIdx]);
    updateTechnicalSkillCategory(targetIdx, temp);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="type-headline-lg">{labels.technicalSkills}</h1>
        <Button variant="primary" size="md" onClick={handleAdd}>
          + {labels.add}
        </Button>
      </div>

      <div className="space-y-6">
        {data.technical_skills.map((techCat, index) => (
          <Card key={index} className="relative group">
            {/* Actions Bar */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => moveItem(index, 'up')} 
                disabled={index === 0}
                className="p-1.5 text-[var(--color-outline)] hover:text-white disabled:opacity-30 transition-colors"
                title="Move Up"
              >
                <IconChevronUp />
              </button>
              <button 
                onClick={() => moveItem(index, 'down')} 
                disabled={index === data.technical_skills.length - 1}
                className="p-1.5 text-[var(--color-outline)] hover:text-white disabled:opacity-30 transition-colors"
                title="Move Down"
              >
                <IconChevronDown />
              </button>
              <div className="w-px h-4 bg-[rgba(229,229,229,0.2)] mx-1" />
              <button 
                onClick={() => removeTechnicalSkillCategory(index)}
                className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors"
                title={labels.remove}
              >
                <IconTrash />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              <Input
                label={labels.category}
                value={techCat.category}
                onChange={(e) => updateTechnicalSkillCategory(index, { category: e.target.value })}
                placeholder="Backend Frameworks"
              />
              
              <ArrayInput
                label={labels.technicalSkills}
                items={techCat.skills}
                onChange={(items) => updateTechnicalSkillCategory(index, { skills: items })}
                placeholder="Express, NestJS, Spring Boot..."
                buttonLabel={labels.add}
              />
            </div>
          </Card>
        ))}

        {data.technical_skills.length === 0 && (
          <div className="text-center p-12 border border-dashed border-[rgba(229,229,229,0.1)] surface-glass">
            <p className="type-body-lg text-[var(--color-on-surface-variant)]">
              No technical skills added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
