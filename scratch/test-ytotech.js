const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const latexEscapes = {
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
  '\\': '\\textbackslash{}',
  '·': '\\textperiodcentered{}',
  '—': '---',
  '–': '--',
  '“': '``',
  '”': "''",
  '‘': '`',
  '’': "'",
  '…': '\\dots{}',
};

function sanitizeLatex(text) {
  if (!text) return '';
  return text.replace(/[&%$#_{}~^\\·—–“”‘’…]/g, (match) => latexEscapes[match]);
}

function sanitizeData(data) {
  if (typeof data === 'string') return sanitizeLatex(data);
  if (Array.isArray(data)) return data.map(sanitizeData);
  if (data !== null && typeof data === 'object') {
    const sanitizedObj = {};
    for (const key in data) {
      sanitizedObj[key] = sanitizeData(data[key]);
    }
    return sanitizedObj;
  }
  return data;
}

const latexLabels = {
  es: {
    professionalProfile: "Perfil Profesional",
    workExperience: "Experiencia Laboral",
    present: "Presente",
    stack: "Stack",
    projects: "Proyectos",
    repo: "Repo",
    demo: "Demo",
    technologies: "Tecnologías",
    education: "Educación",
    certifications: "Certificaciones",
    technicalSkills: "Habilidades Técnicas",
    softSkills: "Habilidades Blandas",
    languages: "Idiomas"
  },
  en: {
    professionalProfile: "Professional Profile",
    workExperience: "Work Experience",
    present: "Present",
    stack: "Stack",
    projects: "Projects",
    repo: "Repo",
    demo: "Demo",
    technologies: "Technologies",
    education: "Education",
    certifications: "Certifications",
    technicalSkills: "Technical Skills",
    softSkills: "Soft Skills",
    languages: "Languages"
  }
};

async function run() {
  const data = JSON.parse(fs.readFileSync('references/extra/no work.json', 'utf8'));
  const sanitizedData = sanitizeData(data);
  const templateString = fs.readFileSync('src/lib/latex/template.hbs', 'utf8');
  const template = Handlebars.compile(templateString, { noEscape: true });
  const lang = sanitizedData.metadata?.language_version === 'en' ? 'en' : 'es';
  const texString = template({ ...sanitizedData, i18n: latexLabels[lang] });
  
  fs.writeFileSync('scratch/output.tex', texString);
  console.log('LaTeX string generated successfully.');
  
  const payload = {
    compiler: 'pdflatex',
    resources: [
      {
        main: true,
        content: texString,
      },
    ],
  };

  const response = await fetch('https://latex.ytotech.com/builds/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    console.error('API Error:', response.status, errorJson.log || errorJson);
  } else {
    console.log('Compilation succeeded.');
  }
}

run();
