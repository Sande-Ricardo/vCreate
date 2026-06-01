'use client';

import { useCvStore } from '@/store/cv.store';
import { PersonalDataSection } from '@/components/sections/PersonalDataSection';
import { WorkExperienceSection } from '@/components/sections/WorkExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { EducationSection } from '@/components/sections/EducationSection';

export function FormArea() {
  const { activeSection } = useCvStore();

  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-2xl mx-auto pb-32">
        {activeSection === 'personal_data' && <PersonalDataSection />}
        {activeSection === 'work_experience' && <WorkExperienceSection />}
        {activeSection === 'projects' && <ProjectsSection />}
        {activeSection === 'education' && <EducationSection />}
        {activeSection === 'certifications' && <div className="p-8 surface-glass">Certifications coming soon...</div>}
        {activeSection === 'technical_skills' && <div className="p-8 surface-glass">Technical Skills coming soon...</div>}
        {activeSection === 'soft_skills_languages' && <div className="p-8 surface-glass">Soft Skills & Languages coming soon...</div>}
      </div>
    </main>
  );
}
