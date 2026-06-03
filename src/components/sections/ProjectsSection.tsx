'use client';

import { useState } from 'react';
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

export function ProjectsSection() {
  const { data, addProject, updateProject, removeProject, reorderProject } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragAllowed, setDragAllowed] = useState(false);

  const handleAdd = () => {
    addProject({
      name: '',
      short_description: '',
      responsibilities: [],
      technologies: [],
      repository_url: '',
      live_demo_url: ''
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="type-headline-lg">{labels.projects}</h1>
        <Button variant="primary" size="md" onClick={handleAdd}>
          + {labels.add}
        </Button>
      </div>

      <div className="space-y-6">
        {data.projects.map((proj, index) => (
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
                reorderProject(draggedIndex, index);
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
                onClick={() => removeProject(index)}
                className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors"
                title={labels.remove}
              >
                <IconTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-4">
              <Input
                label={labels.projectName}
                value={proj.name}
                onChange={(e) => updateProject(index, { name: e.target.value })}
                placeholder="E-Commerce Platform"
              />
              <Input
                label={labels.shortDescription}
                value={proj.short_description}
                onChange={(e) => updateProject(index, { short_description: e.target.value })}
                placeholder="A scalable marketplace built with Next.js..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={labels.repositoryUrl}
                  value={proj.repository_url || ''}
                  onChange={(e) => updateProject(index, { repository_url: e.target.value })}
                  placeholder="https://github.com/..."
                  hint={labels.optional}
                />
                <Input
                  label={labels.liveDemoUrl}
                  value={proj.live_demo_url || ''}
                  onChange={(e) => updateProject(index, { live_demo_url: e.target.value })}
                  placeholder="https://..."
                  hint={labels.optional}
                />
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <ArrayInput
                label={labels.responsibilities}
                items={proj.responsibilities}
                onChange={(items) => updateProject(index, { responsibilities: items })}
                placeholder="Implemented payment gateway..."
                buttonLabel={labels.add}
              />
              <ArrayInput
                label={labels.technologies}
                items={proj.technologies}
                onChange={(items) => updateProject(index, { technologies: items })}
                placeholder="React, Stripe, Vercel..."
                buttonLabel={labels.add}
              />
            </div>
          </Card>
        ))}

        {data.projects.length === 0 && (
          <div className="text-center p-12 border border-dashed border-[rgba(229,229,229,0.1)] surface-glass">
            <p className="type-body-lg text-[var(--color-on-surface-variant)]">
              No projects added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
