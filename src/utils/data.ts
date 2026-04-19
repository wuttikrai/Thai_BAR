import { LegalEntry } from '@/types';
import Papa from 'papaparse';

export async function loadLegalData(): Promise<LegalEntry[]> {
  const entries: LegalEntry[] = [];
  
  // Use NEXT_PUBLIC_BASE_PATH so the URL is correct on both local dev and GitHub Pages.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Load both CSV files and map them to Section (volume)
  const files = [
    { file: 'Bar_Editorials_1.csv', section: 1 },
    { file: 'Bar_Editorials_2.csv', section: 2 },
  ];
  
  for (const { file, section } of files) {
    const response = await fetch(`${basePath}/data/${file}?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${file} (${response.status})`);
    }
    const text = await response.text();
    
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any, index: number) => {
          if (row.year && row.Question) {
            entries.push({
              id: `${file}-${index}`,
              year: parseInt(row.year),
              volume: section,
              fact: row.fact || '',
              question: row.Question || '',
              judgement: row.judgement || '',
              law: row.law || '',
              comment: row.comment || '',
            });
          }
        });
      },
    });
  }
  
  return entries;
}
