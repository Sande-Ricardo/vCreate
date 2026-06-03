'use client';

import { useState } from 'react';
import { useCvStore } from '@/store/cv.store';
import { i18n } from '@/lib/i18n';
import { Input, Card, Button, Checkbox } from '@/components/ui';

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M6 4V2h4v2M5 4v10h6V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function IconGrip() {
  return (
    <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

export function EducationSection() {
  const { data, addEducation, updateEducation, removeEducation, reorderEducation } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragAllowed, setDragAllowed] = useState(false);

  const handleAdd = () => {
    addEducation({
      degree: '',
      institution: '',
      start_date: '',
      end_date: '',
      is_current: false
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="type-headline-lg">{labels.education}</h1>
        <Button variant="primary" size="md" onClick={handleAdd}>
          + {labels.add}
        </Button>
      </div>

      <div className="space-y-6">
        {data.education.map((edu, index) => (
          <Card 
            key={index} 
            className={[
              'relative group transition-all duration-200',
              draggedIndex === index ? 'opacity-40 scale-[0.98]' : '',
              dragOverIndex === index ? 'border-white bg-[rgba(255,255,255,0.06)] shadow-[0_0_10px_rgba(255,255,255,0.1)]' : '',
            ].join(' ')}
            draggable={dragAllowed}
            onDragStart={(e) => {
              setDraggedIndex(index);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedIndex !== null && draggedIndex !== index) {
                setDragOverIndex(index);
              }
            }}
            onDragLeave={() => {
              setDragOverIndex(null);
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
              setDragAllowed(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedIndex !== null && draggedIndex !== index) {
                reorderEducation(draggedIndex, index);
              }
              setDraggedIndex(null);
              setDragOverIndex(null);
              setDragAllowed(false);
            }}
          >
            {/* Actions Bar */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                onMouseDown={() => setDragAllowed(true)}
                onMouseUp={() => setDragAllowed(false)}
                className="cursor-grab active:cursor-grabbing p-1.5 text-[var(--color-outline)] hover:text-white transition-colors"
                title="Drag to Reorder"
              >
                <IconGrip />
              </span>
              <div className="w-px h-4 bg-[rgba(229,229,229,0.2)] mx-1" />
              <button 
                onClick={() => removeEducation(index)}
                className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors"
                title={labels.remove}
              >
                <IconTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Input
                label={labels.degree}
                value={edu.degree}
                onChange={(e) => updateEducation(index, { degree: e.target.value })}
                placeholder="BSc. Computer Science"
              />
              <Input
                label={labels.institution}
                value={edu.institution}
                onChange={(e) => updateEducation(index, { institution: e.target.value })}
                placeholder="University of Tech"
              />
              <Input
                label={labels.startDate}
                value={edu.start_date}
                onChange={(e) => updateEducation(index, { start_date: e.target.value })}
                placeholder="09/2018"
              />
              <div className="flex flex-col gap-3">
                <Input
                  label={labels.endDate}
                  value={edu.is_current ? labels.present : edu.end_date}
                  disabled={edu.is_current}
                  onChange={(e) => updateEducation(index, { end_date: e.target.value })}
                  placeholder="06/2022"
                />
                <Checkbox
                  label={labels.isCurrentEdu}
                  checked={edu.is_current}
                  onChange={(e) => updateEducation(index, { 
                    is_current: e.target.checked,
                    end_date: e.target.checked ? '' : edu.end_date 
                  })}
                />
              </div>
            </div>
          </Card>
        ))}

        {data.education.length === 0 && (
          <div className="text-center p-12 border border-dashed border-[rgba(229,229,229,0.1)] surface-glass">
            <p className="type-body-lg text-[var(--color-on-surface-variant)]">
              No education added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
