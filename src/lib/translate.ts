import { CvData } from '@/types/cv.types';


export interface TranslateOptions {
  apiKey: string;
  sourceLang: 'ES' | 'EN';
  targetLang: 'ES' | 'EN-US';
}

interface DeepLResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}

/**
 * Translates narrative fields of the CvData object using DeepL API.
 * Batches all text into a single API request for performance and rate-limit compliance.
 */
export async function translateCvData(cvData: CvData, options: TranslateOptions): Promise<CvData> {
  const { apiKey, targetLang } = options;
  if (!apiKey) {
    throw new Error('DeepL API key is missing.');
  }

  // 1. Extract strings to translate
  const stringsToTranslate: string[] = [];
  const mapBackToPath: { obj: any; key: string | number }[] = [];

  // Deep clone to safely mutate
  // We can just use JSON parse/stringify since there are no functions or Date objects in CvData
  const translatedData: CvData = JSON.parse(JSON.stringify(cvData));

  // Helper to register a string for translation
  const registerString = (obj: any, key: string | number) => {
    const value = obj[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      stringsToTranslate.push(value);
      mapBackToPath.push({ obj, key });
    }
  };

  // Extract from Personal Data
  registerString(translatedData.personal_data, 'primary_title');
  registerString(translatedData.personal_data, 'secondary_title');
  registerString(translatedData.personal_data, 'location');
  
  // Extract from Professional Profile
  registerString(translatedData, 'professional_profile');

  // Extract from Work Experience
  translatedData.work_experience.forEach((exp) => {
    registerString(exp, 'role');
    exp.responsibilities.forEach((_, i) => registerString(exp.responsibilities, i));
  });

  // Extract from Projects
  translatedData.projects.forEach((proj) => {
    registerString(proj, 'short_description');
    proj.responsibilities.forEach((_, i) => registerString(proj.responsibilities, i));
  });

  // Extract from Education
  translatedData.education.forEach((edu) => {
    registerString(edu, 'degree');
  });

  // Extract from Certifications
  translatedData.certifications.forEach((cert) => {
    registerString(cert, 'name');
  });

  // Extract from Technical Skills (Categories only)
  translatedData.technical_skills.forEach((ts) => {
    registerString(ts, 'category');
  });

  // Extract from Soft Skills
  translatedData.soft_skills.forEach((_, i) => registerString(translatedData.soft_skills, i));

  // Extract from Languages
  translatedData.languages.forEach((lang) => {
    registerString(lang, 'language');
    registerString(lang, 'proficiency');
  });

  if (stringsToTranslate.length === 0) {
    return translatedData; // Nothing to translate
  }

  // 2. Call DeepL API
  const endpointUrl = apiKey.endsWith(':fx') 
    ? 'https://api-free.deepl.com/v2/translate' 
    : 'https://api.deepl.com/v2/translate';

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: stringsToTranslate,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    let errorMsg = 'DeepL translation failed.';
    try {
      const errBody = await response.json();
      errorMsg = errBody.message || errorMsg;
    } catch {
      // Ignored
    }
    throw new Error(`Translation API Error: ${response.status} - ${errorMsg}`);
  }

  const result: DeepLResponse = await response.json();
  const { translations } = result;

  if (!translations || translations.length !== stringsToTranslate.length) {
    throw new Error('Translation API returned a mismatch in translated strings.');
  }

  // 3. Map translated strings back
  translations.forEach((t, index) => {
    const { obj, key } = mapBackToPath[index];
    obj[key] = t.text;
  });

  // Update metadata language version
  translatedData.metadata.language_version = targetLang === 'ES' ? 'es' : 'en';

  return translatedData;
}
