/**
 * cv.types.ts
 *
 * Single source of type truth for the vCreate application.
 * Derived directly from references/structure.json.
 *
 * CRITICAL: All form components, the Zustand store, API routes, and LaTeX
 * template rendering depend on these types. Do not modify them without
 * auditing every consumer.
 */

// ---------------------------------------------------------------------------
// Primitive sub-types
// ---------------------------------------------------------------------------

/** A social or professional link attached to the personal data block. */
export interface Link {
  platform: string;
  url: string;
}

/** A single work experience entry. */
export interface WorkExperience {
  role: string;
  company_or_context: string;
  start_date: string;
  /** Required when is_current is false. Empty string when is_current is true. */
  end_date: string;
  /** When true, end_date must be ignored and rendered as "Present" / "Presente". */
  is_current: boolean;
  responsibilities: string[];
  stack: string[];
}

/** A personal or professional project entry. */
export interface Project {
  name: string;
  short_description: string;
  responsibilities: string[];
  technologies: string[];
  /** Optional: public repository URL. */
  repository_url?: string;
  /** Optional: live demo or deployment URL. */
  live_demo_url?: string;
}

/** A formal or informal education entry. */
export interface Education {
  degree: string;
  institution: string;
  start_date: string;
  /** Required when is_current is false. Empty string when is_current is true. */
  end_date: string;
  /** When true, end_date must be ignored and rendered as "Present" / "Presente". */
  is_current: boolean;
}

/** A professional certification or course completion. */
export interface Certification {
  name: string;
  issuer: string;
  /** ISO date string or human-readable date (e.g. "Mar 2025"). */
  date: string;
  /** Optional: verification or credential URL. */
  url?: string;
}

/** A named category grouping related technical skills. */
export interface TechnicalSkillCategory {
  category: string;
  skills: string[];
}

/** A spoken or written language with a proficiency level. */
export interface Language {
  language: string;
  /** Free-text proficiency level (e.g. "Native", "B2 - Upper Intermediate"). */
  proficiency: string;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

/** Document-level metadata. Populated automatically on save/export. */
export interface CvMetadata {
  /** ISO 8601 timestamp of the last save operation. */
  last_updated: string;
  /**
   * The input language the user chose for this CV instance.
   * 'es' = Spanish | 'en' = English
   */
  language_version: 'es' | 'en';
}

// ---------------------------------------------------------------------------
// Personal Data
// ---------------------------------------------------------------------------

/** The personal and contact information block. */
export interface PersonalData {
  full_name: string;
  primary_title: string;
  secondary_title: string;
  email: string;
  phone: string;
  location: string;
  links: Link[];
}

// ---------------------------------------------------------------------------
// Root document type
// ---------------------------------------------------------------------------

/**
 * CvData — the root document shape.
 *
 * This is the exact object serialized to/from cv_data.json, sent to
 * /api/generate, and held in the Zustand store.
 */
export interface CvData {
  personal_data: PersonalData;
  professional_profile: string;
  work_experience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  technical_skills: TechnicalSkillCategory[];
  soft_skills: string[];
  languages: Language[];
  metadata: CvMetadata;
}

// ---------------------------------------------------------------------------
// Factory / defaults
// ---------------------------------------------------------------------------

/**
 * Returns a fresh, empty CvData object.
 * Use this to initialize the Zustand store or reset the form.
 */
export function createEmptyCvData(language: 'es' | 'en' = 'en'): CvData {
  return {
    personal_data: {
      full_name: '',
      primary_title: '',
      secondary_title: '',
      email: '',
      phone: '',
      location: '',
      links: [],
    },
    professional_profile: '',
    work_experience: [],
    projects: [],
    education: [],
    certifications: [],
    technical_skills: [],
    soft_skills: [],
    languages: [],
    metadata: {
      last_updated: new Date().toISOString(),
      language_version: language,
    },
  };
}
