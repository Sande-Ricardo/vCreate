'use client';

import { useCvStore } from '@/store/cv.store';
import { PersonalDataSection } from '@/components/sections/PersonalDataSection';
import { WorkExperienceSection } from '@/components/sections/WorkExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { TechnicalSkillsSection } from '@/components/sections/TechnicalSkillsSection';
import { SoftSkillsAndLanguagesSection } from '@/components/sections/SoftSkillsAndLanguagesSection';

export function FormArea() {
  const { activeSection } = useCvStore();

  return (
    <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-2xl mx-auto pb-32">
        {activeSection === 'personal_data' && <PersonalDataSection />}
        {activeSection === 'work_experience' && <WorkExperienceSection />}
        {activeSection === 'projects' && <ProjectsSection />}
        {activeSection === 'education' && <EducationSection />}
        {activeSection === 'certifications' && <CertificationsSection />}
        {activeSection === 'technical_skills' && <TechnicalSkillsSection />}
        {activeSection === 'soft_skills_languages' && <SoftSkillsAndLanguagesSection />}
      </div>
    </main>
  );
}
