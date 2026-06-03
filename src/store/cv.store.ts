import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  CvData,
  createEmptyCvData,
  PersonalData,
  WorkExperience,
  Project,
  Education,
  Certification,
  TechnicalSkillCategory,
  Language,
} from '@/types/cv.types';

export interface CvState {
  data: CvData;
  /** Tracks whether the user has modified anything since last save/export. */
  isDirty: boolean;
  /** Tracks whether the initial language selection or JSON load has happened. */
  isInitialized: boolean;
  /** Currently active form section in the UI. */
  activeSection: 'personal_data' | 'work_experience' | 'projects' | 'education' | 'certifications' | 'technical_skills' | 'soft_skills_languages';
  /** Global notification state */
  notification: { message: string; type: 'error' | 'success' | 'info' } | null;
}

export interface CvActions {
  // Global
  loadFromJson: (json: string) => void;
  resetStore: () => void;
  setInputLanguage: (lang: 'es' | 'en') => void;
  setActiveSection: (section: CvState['activeSection']) => void;
  setNotification: (notification: { message: string; type: 'error' | 'success' | 'info' } | null) => void;

  // Personal Data
  updatePersonalData: (data: Partial<PersonalData>) => void;
  updateProfessionalProfile: (profile: string) => void;

  // Work Experience
  addWorkExperience: (item: WorkExperience) => void;
  updateWorkExperience: (index: number, item: Partial<WorkExperience>) => void;
  removeWorkExperience: (index: number) => void;
  reorderWorkExperience: (fromIndex: number, toIndex: number) => void;

  // Projects
  addProject: (item: Project) => void;
  updateProject: (index: number, item: Partial<Project>) => void;
  removeProject: (index: number) => void;
  reorderProject: (fromIndex: number, toIndex: number) => void;

  // Education
  addEducation: (item: Education) => void;
  updateEducation: (index: number, item: Partial<Education>) => void;
  removeEducation: (index: number) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;

  // Certifications
  addCertification: (item: Certification) => void;
  updateCertification: (index: number, item: Partial<Certification>) => void;
  removeCertification: (index: number) => void;

  // Technical Skills
  addTechnicalSkillCategory: (item: TechnicalSkillCategory) => void;
  updateTechnicalSkillCategory: (index: number, item: Partial<TechnicalSkillCategory>) => void;
  removeTechnicalSkillCategory: (index: number) => void;

  // Soft Skills
  setSoftSkills: (skills: string[]) => void;

  // Languages
  addLanguage: (item: Language) => void;
  updateLanguage: (index: number, item: Partial<Language>) => void;
  removeLanguage: (index: number) => void;
}

export type CvStore = CvState & CvActions;

export const useCvStore = create<CvStore>()(
  subscribeWithSelector(
    immer((set) => ({
      data: createEmptyCvData('en'),
      isDirty: false,
      isInitialized: false,
      activeSection: 'personal_data',
      notification: null,

      // Global
      loadFromJson: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr) as CvData;
          // In a production app we'd validate with Zod here
          set((state) => {
            state.data = parsed;
            state.isDirty = false;
            state.isInitialized = true;
            state.notification = {
              message: 'CV draft loaded successfully.',
              type: 'success',
            };
          });
        } catch (e) {
          console.error('Failed to parse CV JSON', e);
          set((state) => {
            state.notification = {
              message: e instanceof Error ? `Failed to parse CV JSON: ${e.message}` : 'Failed to parse CV JSON',
              type: 'error',
            };
          });
        }
      },
      setNotification: (notification) =>
        set((state) => {
          state.notification = notification;
        }),
      resetStore: () =>
        set((state) => {
          state.data = createEmptyCvData('en');
          state.isDirty = false;
          state.isInitialized = false;
        }),
      setInputLanguage: (lang) =>
        set((state) => {
          state.data.metadata.language_version = lang;
          state.isDirty = true;
          state.isInitialized = true;
        }),
      setActiveSection: (section) =>
        set((state) => {
          state.activeSection = section;
        }),

      // Personal Data
      updatePersonalData: (updates) =>
        set((state) => {
          Object.assign(state.data.personal_data, updates);
          state.isDirty = true;
        }),
      updateProfessionalProfile: (profile) =>
        set((state) => {
          state.data.professional_profile = profile;
          state.isDirty = true;
        }),

      // Work Experience
      addWorkExperience: (item) =>
        set((state) => {
          state.data.work_experience.push(item);
          state.isDirty = true;
        }),
      updateWorkExperience: (idx, updates) =>
        set((state) => {
          Object.assign(state.data.work_experience[idx], updates);
          state.isDirty = true;
        }),
      removeWorkExperience: (idx) =>
        set((state) => {
          state.data.work_experience.splice(idx, 1);
          state.isDirty = true;
        }),
      reorderWorkExperience: (from, to) =>
        set((state) => {
          const [removed] = state.data.work_experience.splice(from, 1);
          if (removed) {
            state.data.work_experience.splice(to, 0, removed);
            state.isDirty = true;
          }
        }),

      // Projects
      addProject: (item) =>
        set((state) => {
          state.data.projects.push(item);
          state.isDirty = true;
        }),
      updateProject: (idx, updates) =>
        set((state) => {
          Object.assign(state.data.projects[idx], updates);
          state.isDirty = true;
        }),
      removeProject: (idx) =>
        set((state) => {
          state.data.projects.splice(idx, 1);
          state.isDirty = true;
        }),
      reorderProject: (from, to) =>
        set((state) => {
          const [removed] = state.data.projects.splice(from, 1);
          if (removed) {
            state.data.projects.splice(to, 0, removed);
            state.isDirty = true;
          }
        }),

      // Education
      addEducation: (item) =>
        set((state) => {
          state.data.education.push(item);
          state.isDirty = true;
        }),
      updateEducation: (idx, updates) =>
        set((state) => {
          Object.assign(state.data.education[idx], updates);
          state.isDirty = true;
        }),
      removeEducation: (idx) =>
        set((state) => {
          state.data.education.splice(idx, 1);
          state.isDirty = true;
        }),
      reorderEducation: (from, to) =>
        set((state) => {
          const [removed] = state.data.education.splice(from, 1);
          if (removed) {
            state.data.education.splice(to, 0, removed);
            state.isDirty = true;
          }
        }),

      // Certifications
      addCertification: (item) =>
        set((state) => {
          state.data.certifications.push(item);
          state.isDirty = true;
        }),
      updateCertification: (idx, updates) =>
        set((state) => {
          Object.assign(state.data.certifications[idx], updates);
          state.isDirty = true;
        }),
      removeCertification: (idx) =>
        set((state) => {
          state.data.certifications.splice(idx, 1);
          state.isDirty = true;
        }),

      // Technical Skills
      addTechnicalSkillCategory: (item) =>
        set((state) => {
          state.data.technical_skills.push(item);
          state.isDirty = true;
        }),
      updateTechnicalSkillCategory: (idx, updates) =>
        set((state) => {
          Object.assign(state.data.technical_skills[idx], updates);
          state.isDirty = true;
        }),
      removeTechnicalSkillCategory: (idx) =>
        set((state) => {
          state.data.technical_skills.splice(idx, 1);
          state.isDirty = true;
        }),

      // Soft Skills
      setSoftSkills: (skills) =>
        set((state) => {
          state.data.soft_skills = skills;
          state.isDirty = true;
        }),

      // Languages
      addLanguage: (item) =>
        set((state) => {
          state.data.languages.push(item);
          state.isDirty = true;
        }),
      updateLanguage: (idx, updates) =>
        set((state) => {
          Object.assign(state.data.languages[idx], updates);
          state.isDirty = true;
        }),
      removeLanguage: (idx) =>
        set((state) => {
          state.data.languages.splice(idx, 1);
          state.isDirty = true;
        }),
    })),
  ),
);
