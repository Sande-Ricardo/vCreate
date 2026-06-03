'use client';

import { useCvStore } from '@/store/cv.store';
import { i18n } from '@/lib/i18n';

function SkeletonLine({ width = 'w-full', className = '' }: { width?: string, className?: string }) {
  return <div className={`h-[clamp(4px,1.25cqw,12px)] bg-[rgba(255,255,255,0.05)] rounded-none ${width} ${className}`} />;
}

export function CvPreview() {
  const { data } = useCvStore();
  const lang = data.metadata.language_version;
  const labels = i18n[lang];

  return (
    <div className="w-full h-full flex justify-center overflow-y-auto overflow-x-hidden p-[clamp(8px,2cqw,16px)] custom-scrollbar">
      {/* A4 Aspect Ratio Container: standard A4 is 1 : 1.414 */}
      <div 
        style={{ containerType: 'inline-size' }}
        className="w-full max-w-[800px] bg-[rgba(255,255,255,0.02)] border border-[rgba(229,229,229,0.1)] shadow-2xl shrink-0 h-max min-h-[141.4cqw] p-[clamp(12px,4cqw,32px)] flex flex-col gap-[clamp(12px,4cqw,32px)] text-[var(--color-on-surface)]"
      >
        
        {/* Header */}
        <header className="text-center border-b border-[rgba(229,229,229,0.1)] pb-[clamp(10px,3cqw,24px)]">
          <h1 className="text-[clamp(16px,4.5cqw,30px)] font-bold tracking-tight text-white mb-[clamp(4px,1cqw,8px)] uppercase">
            {data.personal_data.full_name || <SkeletonLine width="w-[clamp(100px,32cqw,256px)]" className="mx-auto h-[clamp(12px,4cqw,32px)]" />}
          </h1>
          <div className="text-[clamp(10px,2cqw,14px)] tracking-widest text-[var(--color-primary)] uppercase mb-[clamp(6px,1.5cqw,12px)] flex items-center justify-center gap-[clamp(4px,1cqw,8px)]">
            {data.personal_data.primary_title ? (
              <span>{data.personal_data.primary_title}</span>
            ) : <SkeletonLine width="w-[clamp(60px,16cqw,128px)]" />}
            {data.personal_data.secondary_title && (
              <>
                <span className="text-[rgba(255,255,255,0.2)]">|</span>
                <span>{data.personal_data.secondary_title}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-[clamp(6px,2cqw,16px)] gap-y-[clamp(4px,1cqw,8px)] text-[clamp(8px,1.4cqw,11px)] text-[var(--color-on-surface-variant)]">
            {data.personal_data.email && <span>{data.personal_data.email}</span>}
            {data.personal_data.phone && <span>{data.personal_data.phone}</span>}
            {data.personal_data.location && <span>{data.personal_data.location}</span>}
            {data.personal_data.links.map((link, i) => (
              <span key={i} className="text-[var(--color-outline)]">
                {link.platform}: {link.url}
              </span>
            ))}
            {(!data.personal_data.email && !data.personal_data.phone && !data.personal_data.location && data.personal_data.links.length === 0) && (
              <div className="flex gap-[clamp(6px,2cqw,16px)] w-full justify-center mt-[clamp(4px,1cqw,8px)]">
                <SkeletonLine width="w-[clamp(48px,12cqw,96px)]" />
                <SkeletonLine width="w-[clamp(48px,12cqw,96px)]" />
                <SkeletonLine width="w-[clamp(48px,12cqw,96px)]" />
              </div>
            )}
          </div>
        </header>

        {/* Professional Profile */}
        <section>
          <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
            {labels.professionalProfile}
          </h2>
          {data.professional_profile ? (
            <p className="text-[clamp(9px,1.8cqw,14px)] leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-wrap">
              {data.professional_profile}
            </p>
          ) : (
            <div className="space-y-[clamp(4px,1cqw,8px)] mt-[clamp(4px,1cqw,8px)]">
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine width="w-3/4" />
            </div>
          )}
        </section>

        {/* Work Experience */}
        <section>
          <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
            {labels.workExperience}
          </h2>
          {data.work_experience.length > 0 ? (
            <div className="space-y-[clamp(8px,2.5cqw,20px)]">
              {data.work_experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-[clamp(2px,0.5cqw,4px)]">
                    <h3 className="font-semibold text-white text-[clamp(10px,2cqw,14px)]">{exp.role || <SkeletonLine width="w-[clamp(60px,16cqw,128px)]" className="inline-block" />}</h3>
                    <span className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-outline)]">
                      {exp.start_date || 'MM/YYYY'} - {exp.is_current ? labels.present : (exp.end_date || 'MM/YYYY')}
                    </span>
                  </div>
                  <div className="text-[clamp(8px,1.4cqw,12px)] font-medium text-[var(--color-primary)] mb-[clamp(4px,1cqw,8px)]">
                    {exp.company_or_context || <SkeletonLine width="w-[clamp(48px,12cqw,96px)]" className="inline-block" />}
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-[clamp(8px,1.4cqw,12px)] space-y-[clamp(2px,0.5cqw,4px)] text-[var(--color-on-surface-variant)] ml-[clamp(2px,0.5cqw,4px)] mb-[clamp(4px,1cqw,8px)]">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                  {exp.stack.length > 0 && (
                    <div className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-outline)]">
                      <span className="font-semibold mr-[clamp(2px,0.5cqw,4px)]">Stack:</span>
                      {exp.stack.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-[clamp(6px,2cqw,16px)]">
              <div>
                <div className="flex justify-between mb-[clamp(4px,1cqw,8px)]"><SkeletonLine width="w-[clamp(60px,16cqw,128px)]" /><SkeletonLine width="w-[clamp(30px,8cqw,64px)]" /></div>
                <SkeletonLine width="w-[clamp(48px,12cqw,96px)]" className="mb-[clamp(4px,1cqw,8px)]" />
                <div className="space-y-[clamp(2px,0.5cqw,4px)] ml-[clamp(8px,2cqw,16px)]"><SkeletonLine /><SkeletonLine width="w-4/5" /></div>
              </div>
            </div>
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
            {labels.projects}
          </h2>
          {data.projects.length > 0 ? (
            <div className="space-y-[clamp(8px,2.5cqw,20px)]">
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-[clamp(2px,0.5cqw,4px)]">
                    <h3 className="font-semibold text-white text-[clamp(10px,2cqw,14px)]">{proj.name || <SkeletonLine width="w-[clamp(60px,16cqw,128px)]" className="inline-block" />}</h3>
                    <div className="flex gap-[clamp(4px,1cqw,8px)] text-[clamp(8px,1.4cqw,12px)] text-[var(--color-outline)]">
                      {proj.repository_url && <span>Repo</span>}
                      {proj.live_demo_url && <span>Demo</span>}
                    </div>
                  </div>
                  <div className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-on-surface-variant)] mb-[clamp(4px,1cqw,8px)]">
                    {proj.short_description || <SkeletonLine width="w-full" />}
                  </div>
                  {proj.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-[clamp(8px,1.4cqw,12px)] space-y-[clamp(2px,0.5cqw,4px)] text-[var(--color-on-surface-variant)] ml-[clamp(2px,0.5cqw,4px)] mb-[clamp(4px,1cqw,8px)]">
                      {proj.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-outline)]">
                      <span className="font-semibold mr-[clamp(2px,0.5cqw,4px)]">Technologies:</span>
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-[clamp(6px,2cqw,16px)]">
              <div>
                <div className="flex justify-between mb-[clamp(4px,1cqw,8px)]"><SkeletonLine width="w-[clamp(60px,16cqw,128px)]" /></div>
                <SkeletonLine width="w-full" className="mb-[clamp(4px,1cqw,8px)]" />
                <div className="space-y-[clamp(2px,0.5cqw,4px)] ml-[clamp(8px,2cqw,16px)]"><SkeletonLine /><SkeletonLine width="w-4/5" /></div>
              </div>
            </div>
          )}
        </section>

        {/* Education & Certifications Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(12px,4cqw,32px)]">
          {/* Education */}
          <section>
            <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
              {labels.education}
            </h2>
            {data.education.length > 0 ? (
              <div className="space-y-[clamp(6px,2cqw,16px)]">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-white text-[clamp(10px,2cqw,14px)] leading-tight mb-[clamp(2px,0.5cqw,4px)]">{edu.degree || <SkeletonLine width="w-3/4" />}</h3>
                    <div className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-on-surface-variant)] mb-[clamp(2px,0.5cqw,4px)]">{edu.institution || <SkeletonLine width="w-1/2" />}</div>
                    <div className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-outline)]">
                      {edu.start_date || 'MM/YYYY'} - {edu.is_current ? labels.present : (edu.end_date || 'MM/YYYY')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-[clamp(4px,1cqw,8px)]">
                <SkeletonLine width="w-3/4" />
                <SkeletonLine width="w-1/2" />
                <SkeletonLine width="w-1/3" />
              </div>
            )}
          </section>

          {/* Certifications */}
          <section>
            <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
              {labels.certifications}
            </h2>
            {data.certifications.length > 0 ? (
              <div className="space-y-[clamp(6px,2cqw,16px)]">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-white text-[clamp(10px,2cqw,14px)] leading-tight mb-[clamp(2px,0.5cqw,4px)]">{cert.name || <SkeletonLine width="w-3/4" />}</h3>
                    <div className="flex justify-between items-center text-[clamp(8px,1.4cqw,12px)]">
                      <span className="text-[var(--color-on-surface-variant)]">{cert.issuer || <SkeletonLine width="w-1/2" className="inline-block" />}</span>
                      <span className="text-[var(--color-outline)]">{cert.date || 'MM/YYYY'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-[clamp(4px,1cqw,8px)]">
                <SkeletonLine width="w-3/4" />
                <SkeletonLine width="w-1/2" />
              </div>
            )}
          </section>
        </div>

        {/* Skills & Languages Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(12px,4cqw,32px)] mt-auto">
          {/* Technical Skills */}
          <section>
            <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
              {labels.technicalSkills}
            </h2>
            {data.technical_skills.length > 0 ? (
              <div className="space-y-[clamp(4px,1cqw,8px)]">
                {data.technical_skills.map((ts, i) => (
                  <div key={i} className="text-[clamp(8px,1.4cqw,12px)]">
                    <span className="font-semibold text-white mr-[clamp(2px,0.5cqw,4px)]">{ts.category || <SkeletonLine width="w-[clamp(32px,8cqw,64px)]" className="inline-block" />}:</span>
                    <span className="text-[var(--color-on-surface-variant)]">
                      {ts.skills.length > 0 ? ts.skills.join(', ') : <SkeletonLine width="w-[clamp(48px,12cqw,96px)]" className="inline-block" />}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-[clamp(4px,1cqw,8px)]">
                <SkeletonLine />
                <SkeletonLine width="w-4/5" />
              </div>
            )}
          </section>

          {/* Soft Skills & Languages */}
          <section>
            <h2 className="text-[clamp(11px,2.25cqw,14px)] font-bold tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-[clamp(2px,0.5cqw,4px)] mb-[clamp(6px,1.5cqw,12px)] text-white">
              {labels.softSkills} & {labels.languages}
            </h2>
            <div className="space-y-[clamp(6px,2cqw,16px)]">
              {data.soft_skills.length > 0 ? (
                <div className="text-[clamp(8px,1.4cqw,12px)] text-[var(--color-on-surface-variant)]">
                  <span className="font-semibold text-white mr-[clamp(2px,0.5cqw,4px)]">{labels.softSkills}:</span>
                  {data.soft_skills.join(', ')}
                </div>
              ) : (
                <SkeletonLine />
              )}
              
              {data.languages.length > 0 ? (
                <div className="space-y-[clamp(2px,0.5cqw,4px)]">
                  {data.languages.map((langItem, i) => (
                    <div key={i} className="text-[clamp(8px,1.4cqw,12px)] flex justify-between">
                      <span className="text-white">{langItem.language || <SkeletonLine width="w-[clamp(32px,8cqw,64px)]" className="inline-block" />}</span>
                      <span className="text-[var(--color-outline)]">{langItem.proficiency || <SkeletonLine width="w-[clamp(32px,8cqw,64px)]" className="inline-block" />}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-[clamp(2px,0.5cqw,4px)]"><SkeletonLine width="w-full" /><SkeletonLine width="w-full" /></div>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
