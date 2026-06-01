'use client';

import { useCvStore } from '@/store/cv.store';
import { i18n } from '@/lib/i18n';
import { Input, Textarea, Card, Button, IconWrapper } from '@/components/ui';

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4h10M6 4V2h4v2M5 4v10h6V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function PersonalDataSection() {
  const { data, updatePersonalData, updateProfessionalProfile } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

  const personalData = data.personal_data;

  const handleLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...personalData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updatePersonalData({ links: newLinks });
  };

  const addLink = () => {
    updatePersonalData({ links: [...personalData.links, { platform: '', url: '' }] });
  };

  const removeLink = (index: number) => {
    const newLinks = personalData.links.filter((_, i) => i !== index);
    updatePersonalData({ links: newLinks });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h1 className="type-headline-lg">{labels.personalData}</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={labels.fullName}
            value={personalData.full_name}
            onChange={(e) => updatePersonalData({ full_name: e.target.value })}
            placeholder="John Doe"
          />
          <Input
            label={labels.email}
            type="email"
            value={personalData.email}
            onChange={(e) => updatePersonalData({ email: e.target.value })}
            placeholder="john@example.com"
          />
          <Input
            label={labels.primaryTitle}
            value={personalData.primary_title}
            onChange={(e) => updatePersonalData({ primary_title: e.target.value })}
            placeholder="Software Engineer"
          />
          <Input
            label={labels.secondaryTitle}
            value={personalData.secondary_title}
            onChange={(e) => updatePersonalData({ secondary_title: e.target.value })}
            placeholder="Full Stack Developer"
            hint={labels.optional}
          />
          <Input
            label={labels.phone}
            value={personalData.phone}
            onChange={(e) => updatePersonalData({ phone: e.target.value })}
            placeholder="+1 234 567 890"
          />
          <Input
            label={labels.location}
            value={personalData.location}
            onChange={(e) => updatePersonalData({ location: e.target.value })}
            placeholder="New York, USA"
          />
        </div>
      </Card>

      <div>
        <h2 className="type-title-md mb-4">{labels.professionalProfile}</h2>
        <Card withNode={false}>
          <Textarea
            value={data.professional_profile}
            onChange={(e) => updateProfessionalProfile(e.target.value)}
            placeholder="Brief overview of your professional background..."
            rows={6}
          />
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="type-title-md">{labels.links}</h2>
          <Button variant="secondary" size="sm" onClick={addLink}>
            + {labels.add}
          </Button>
        </div>
        
        <div className="space-y-4">
          {personalData.links.map((link, index) => (
            <Card key={index} className="!p-4 flex gap-4 items-start" withNode={false}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <Input
                  label={labels.platform}
                  value={link.platform}
                  onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                  placeholder="LinkedIn, GitHub, Portfolio..."
                />
                <Input
                  label={labels.url}
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <button 
                onClick={() => removeLink(index)}
                className="mt-7 p-2 hover:bg-[rgba(255,180,171,0.1)] transition-colors text-[var(--color-outline)] hover:text-[var(--color-error)]"
                title={labels.remove}
              >
                <IconTrash />
              </button>
            </Card>
          ))}
          {personalData.links.length === 0 && (
            <p className="type-body-md text-[var(--color-on-surface-variant)] text-center p-8 border border-dashed border-[rgba(229,229,229,0.1)]">
              No links added.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
