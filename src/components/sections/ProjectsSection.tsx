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

export function ProjectsSection() {
  const { data, addProject, updateProject, removeProject } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

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

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.projects.length - 1) return;
    
    const arr = [...data.projects];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    const temp = arr[index];
    updateProject(index, arr[targetIdx]);
    updateProject(targetIdx, temp);
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
                disabled={index === data.projects.length - 1}
                className="p-1.5 text-[var(--color-outline)] hover:text-white disabled:opacity-30 transition-colors"
                title="Move Down"
              >
                <IconChevronDown />
              </button>
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
