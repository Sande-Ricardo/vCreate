import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { CvData } from '@/types/cv.types';
import { sanitizeLatex } from './sanitize';

// Helper for deep cloning and sanitizing
function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeLatex(data);
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  if (data !== null && typeof data === 'object') {
    const sanitizedObj: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedObj[key] = sanitizeData(data[key]);
      }
    }
    return sanitizedObj;
  }
  return data;
}

export async function generateLatexString(data: CvData): Promise<string> {
  const sanitizedData = sanitizeData(data);
  
  // Read template file
  const templatePath = path.join(process.cwd(), 'src', 'lib', 'latex', 'template.hbs');
  const templateString = await fs.readFile(templatePath, 'utf8');
  
  // Compile and run Handlebars
  const template = Handlebars.compile(templateString, { noEscape: true }); // noEscape is important! We already escaped for LaTeX.
  return template(sanitizedData);
}

export async function compilePdf(texString: string): Promise<Buffer> {
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = '';
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.log || JSON.stringify(errorJson);
    } catch {
      errorMsg = await response.text();
    }
    throw new Error(`LaTeX compilation failed (${response.status}): ${errorMsg}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
