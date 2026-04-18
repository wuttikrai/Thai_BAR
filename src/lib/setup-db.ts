/**
 * Database Setup Script
 * 
 * This script initializes the MySQL database and imports CSV data.
 * 
 * Usage:
 * 1. Configure database credentials in .env file:
 *    DB_HOST=localhost
 *    DB_USER=root
 *    DB_PASSWORD=your_password
 *    DB_NAME=legal_editorials
 * 
 * 2. Run the initialization:
 *    curl -X POST http://localhost:3000/api/legal?action=init
 * 
 * Or run directly with Node:
 *    npx ts-node src/lib/setup-db.ts
 */

import { initDatabase, importCSVData } from './db';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

async function setup() {
  console.log('Initializing database...');
  
  try {
    // Initialize database tables
    await initDatabase();
    
    // Parse CSV files
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

    // Import to database
    await importCSVData(allEntries);
    
    console.log(`✅ Setup complete! Imported ${allEntries.length} entries.`);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();