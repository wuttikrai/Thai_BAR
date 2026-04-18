import { NextResponse } from 'next/server';
import { searchLegalEntries, getTotalCount, initDatabase, importCSVData } from '@/lib/db';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'ทั้งหมด';
    const year = searchParams.get('year') || '';
    const volume = searchParams.get('volume') || '';
    const query = searchParams.get('q') || '';
    const column = searchParams.get('column') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const results = await searchLegalEntries({
      category,
      year,
      volume,
      query,
      column,
      limit,
      offset,
    });

    const total = await getTotalCount({
      category,
      year,
      volume,
      query,
      column,
    });

    return NextResponse.json({
      data: results,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching legal entries:', error);
    
    // If database connection fails, fall back to CSV data
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return NextResponse.json({
        error: 'Database not available, using CSV fallback',
        data: [],
        total: 0,
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch legal entries', details: error.message },
      { status: 500 }
    );
  }
}

// Initialize database and import CSV data
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'init') {
      // Initialize database
      await initDatabase();
      
      // Parse CSV files and import
      const csvFiles = ['Bar_Editorials_1.csv', 'Bar_Editorials_2.csv'];
      const allEntries: any[] = [];

      for (const file of csvFiles) {
        const filePath = path.join(process.cwd(), 'data', file);
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          
          Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              results.data.forEach((row: any, index: number) => {
                if (row.year && row.Question) {
                  allEntries.push({
                    id: `${file}-${index}`,
                    year: parseInt(row.year),
                    volume: parseInt(row.volume) || 1,
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
      }

      await importCSVData(allEntries);

      return NextResponse.json({
        success: true,
        message: `Database initialized and ${allEntries.length} entries imported`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error.message },
      { status: 500 }
    );
  }
}