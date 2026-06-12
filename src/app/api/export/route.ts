import { NextRequest, NextResponse } from 'next/server';
import { generateLatexString, compilePdf } from '@/lib/latex/compiler';
import { CvData } from '@/types/cv.types';
import { translateCvData } from '@/lib/translate';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data: CvData = body.data;
    const format: string = body.format || 'pdf_only'; 
    // format can be: 'pdf_only', 'zip_single_language_json', 'zip_all_languages', 'zip_all_languages_json'
    const apiKey: string | undefined = body.apiKey || process.env.DEEPL_API_KEY;

    if (!data) {
      return NextResponse.json({ error: 'Missing CV data' }, { status: 400 });
    }

    // Determine current language
    const currentLang = data.metadata.language_version;

    // Helper to generate a single PDF
    const generatePdf = async (cv: CvData) => {
      const texString = await generateLatexString(cv);
      return await compilePdf(texString);
    };

    // If format requires all languages, we need to translate
    const requiresTranslation = format === 'zip_all_languages' || format === 'zip_all_languages_json';
    let translatedData: CvData | null = null;

    if (requiresTranslation) {
      if (!apiKey) {
        return NextResponse.json({ error: 'Se requiere una API Key de DeepL para la generación bilingüe.' }, { status: 400 });
      }
      
      const targetLang = currentLang === 'es' ? 'EN-US' : 'ES';
      translatedData = await translateCvData(data, {
        apiKey,
        sourceLang: currentLang === 'es' ? 'ES' : 'EN',
        targetLang,
      });
    }

    if (format === 'pdf_only') {
      const pdfBuffer = await generatePdf(data);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="CV_${data.personal_data.full_name?.replace(/\s+/g, '_') || 'Draft'}.pdf"`,
        },
      });
    }

    // ZIP Generation
    const zip = new JSZip();
    const baseName = data.personal_data.full_name?.replace(/\s+/g, '_') || 'Draft';

    if (format === 'zip_single_language_json') {
      const pdfBuffer = await generatePdf(data);
      zip.file(`CV_${baseName}_${currentLang.toUpperCase()}.pdf`, pdfBuffer);
      zip.file(`CV_Data.json`, JSON.stringify(data, null, 2));
    } else if (requiresTranslation && translatedData) {
      // Parallel compilation
      const [currentPdfBuffer, translatedPdfBuffer] = await Promise.all([
        generatePdf(data),
        generatePdf(translatedData)
      ]);

      const translatedLang = currentLang === 'es' ? 'EN' : 'ES';
      zip.file(`CV_${baseName}_${currentLang.toUpperCase()}.pdf`, currentPdfBuffer);
      zip.file(`CV_${baseName}_${translatedLang}.pdf`, translatedPdfBuffer);

      if (format === 'zip_all_languages_json') {
        zip.file(`CV_Data_${currentLang.toUpperCase()}.json`, JSON.stringify(data, null, 2));
        zip.file(`CV_Data_${translatedLang}.json`, JSON.stringify(translatedData, null, 2));
      }
    } else {
      return NextResponse.json({ error: 'Formato no soportado.' }, { status: 400 });
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="CV_Export_${baseName}.zip"`,
      },
    });

  } catch (error: any) {
    console.error('Export API Error:', error);
    let errorMessage = error.message || 'Internal Server Error';
    
    // Check if the error comes from YtoTech 500 Server Error
    if (errorMessage.includes('LaTeX compilation failed (500)') || errorMessage.includes('"SERVER_ERROR"')) {
      errorMessage = 'The third-party PDF compilation service (YtoTech) is currently down or experiencing issues. Please save your draft and try again later.';
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
