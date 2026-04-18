import { LegalEntry } from '@/types';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

// CSV-based data storage (fallback when MySQL is not available)
let cachedData: LegalEntry[] | null = null;

function loadCSVData(): LegalEntry[] {
  if (cachedData) return cachedData;
  
  const entries: LegalEntry[] = [];
  // Section mapping: Bar_Editorials_1.csv = Section 1, Bar_Editorials_2.csv = Section 2
  const csvFiles = [
    { file: 'Bar_Editorials_1.csv', section: 1 },
    { file: 'Bar_Editorials_2.csv', section: 2 },
  ];
  
  for (const { file, section } of csvFiles) {
    const filePath = path.join(process.cwd(), 'data', file);
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Use synchronous parsing - cast to any to handle TypeScript issue
      const results: any = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });
      
      if (results && results.data) {
        results.data.forEach((row: any, index: number) => {
          if (row.year && row.Question) {
            entries.push({
              id: `${file}-${index}`,
              year: parseInt(row.year),
              volume: section, // Store section as volume: 1 = ภาค 1, 2 = ภาค 2
              fact: row.fact || '',
              question: row.Question || '',
              judgement: row.judgement || '',
              law: row.law || '',
              comment: row.comment || '',
            });
          }
        });
      }
    }
  }
  
  cachedData = entries;
  return entries;
}

// Database configuration
const dbConfig = {
  useMySQL: process.env.USE_MYSQL === 'true',
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'legal_editorials',
};

// MySQL will be dynamically imported when available
let mysql: any = null;
let pool: any = null;

async function getMySQL() {
  if (!mysql && dbConfig.useMySQL) {
    try {
      mysql = await import('mysql2/promise');
    } catch (e) {
      console.warn('MySQL not available, using CSV fallback');
    }
  }
  return mysql;
}

async function getPool() {
  const mysql = await getMySQL();
  if (!mysql || !dbConfig.useMySQL) return null;
  
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });
  }
  return pool;
}

// Search legal entries
// Note: volume parameter now represents Section (ภาค): '1' = Bar_Editorials_1, '2' = Bar_Editorials_2
export async function searchLegalEntries(options: {
  category?: string;
  year?: string;
  volume?: string; // Section: '1' or '2'
  query?: string;
  column?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, year, volume, query, column = 'all', limit = 50, offset = 0 } = options;
  
  // Try MySQL first if enabled
  if (dbConfig.useMySQL) {
    try {
      const pool = await getPool();
      if (pool) {
        let sql = 'SELECT * FROM legal_entries WHERE 1=1';
        const params: any[] = [];
        
        if (category && category !== 'ทั้งหมด') {
          sql += ' AND law = ?';
          params.push(category);
        }
        
        if (year) {
          sql += ' AND year = ?';
          params.push(parseInt(year));
        }
        
        // volume now represents Section (ภาค 1 or ภาค 2)
        // In the CSV data, this is stored in the source file
        if (volume) {
          // For MySQL, we might need a section column or filter by source
          // This depends on how the data is stored
          sql += ' AND volume = ?';
          params.push(parseInt(volume));
        }
        
        if (query) {
          const searchTerm = `%${query}%`;
          if (column === 'all') {
            sql += ' AND (question LIKE ? OR fact LIKE ? OR judgement LIKE ? OR comment LIKE ?)';
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
          } else {
            const colMap: Record<string, string> = {
              'fact': 'fact',
              'question': 'question',
              'judgement': 'judgement',
              'law': 'law',
              'comment': 'comment',
              'misc': 'misc',
            };
            const dbColumn = colMap[column] || 'question';
            sql += ` AND ${dbColumn} LIKE ?`;
            params.push(searchTerm);
          }
        }
        
        sql += ' ORDER BY year DESC, volume DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const [rows] = await pool.execute(sql, params);
        return rows as LegalEntry[];
      }
    } catch (error) {
      console.warn('MySQL query failed, falling back to CSV:', error);
    }
  }
  
  // Fallback to CSV data
  let results = loadCSVData();
  
  // Apply filters
  if (category && category !== 'ทั้งหมด') {
    results = results.filter(entry => entry.law === category);
  }
  
  if (year) {
    results = results.filter(entry => entry.year === parseInt(year));
  }
  
  if (volume) {
    results = results.filter(entry => entry.volume === parseInt(volume));
  }
  
  if (query) {
    const q = query.toLowerCase();
    const colMap: Record<string, (entry: LegalEntry) => boolean> = {
      'all': (entry) => 
        entry.question.toLowerCase().includes(q) ||
        entry.fact.toLowerCase().includes(q) ||
        entry.judgement.toLowerCase().includes(q) ||
        (entry.comment?.toLowerCase().includes(q) ?? false) ||
        (entry.misc?.toLowerCase().includes(q) ?? false),
      'fact': (entry) => entry.fact.toLowerCase().includes(q),
      'question': (entry) => entry.question.toLowerCase().includes(q),
      'judgement': (entry) => entry.judgement.toLowerCase().includes(q),
      'law': (entry) => entry.law.toLowerCase().includes(q),
      'comment': (entry) => entry.comment?.toLowerCase().includes(q) || false,
      'misc': (entry) => entry.misc?.toLowerCase().includes(q) || false,
    };
    
    const filterFn = colMap[column] || colMap['all'];
    results = results.filter(filterFn);
  }
  
  // Apply pagination
  return results.slice(offset, offset + limit);
}

// Get total count for pagination
export async function getTotalCount(options: {
  category?: string;
  year?: string;
  volume?: string;
  query?: string;
  column?: string;
}) {
  const { category, year, volume, query, column = 'all' } = options;
  
  // Try MySQL first if enabled
  if (dbConfig.useMySQL) {
    try {
      const pool = await getPool();
      if (pool) {
        let sql = 'SELECT COUNT(*) as total FROM legal_entries WHERE 1=1';
        const params: any[] = [];
        
        if (category && category !== 'ทั้งหมด') {
          sql += ' AND law = ?';
          params.push(category);
        }
        
        if (year) {
          sql += ' AND year = ?';
          params.push(parseInt(year));
        }
        
        if (volume) {
          sql += ' AND volume = ?';
          params.push(parseInt(volume));
        }
        
        if (query) {
          const searchTerm = `%${query}%`;
          if (column === 'all') {
            sql += ' AND (question LIKE ? OR fact LIKE ? OR judgement LIKE ? OR comment LIKE ?)';
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
          } else {
            const colMap: Record<string, string> = {
              'fact': 'fact',
              'question': 'question',
              'judgement': 'judgement',
              'law': 'law',
              'comment': 'comment',
              'misc': 'misc',
            };
            const dbColumn = colMap[column] || 'question';
            sql += ` AND ${dbColumn} LIKE ?`;
            params.push(searchTerm);
          }
        }
        
        const [rows] = await pool.execute(sql, params);
        return (rows as any[])[0]?.total || 0;
      }
    } catch (error) {
      console.warn('MySQL count failed, falling back to CSV:', error);
    }
  }
  
  // Fallback to CSV data
  let results = loadCSVData();
  
  if (category && category !== 'ทั้งหมด') {
    results = results.filter(entry => entry.law === category);
  }
  
  if (year) {
    results = results.filter(entry => entry.year === parseInt(year));
  }
  
  if (volume) {
    results = results.filter(entry => entry.volume === parseInt(volume));
  }
  
  if (query) {
    const q = query.toLowerCase();
    const colMap: Record<string, (entry: LegalEntry) => boolean> = {
      'all': (entry) => 
        entry.question.toLowerCase().includes(q) ||
        entry.fact.toLowerCase().includes(q) ||
        entry.judgement.toLowerCase().includes(q) ||
        (entry.comment?.toLowerCase().includes(q) ?? false) ||
        (entry.misc?.toLowerCase().includes(q) ?? false),
      'fact': (entry) => entry.fact.toLowerCase().includes(q),
      'question': (entry) => entry.question.toLowerCase().includes(q),
      'judgement': (entry) => entry.judgement.toLowerCase().includes(q),
      'law': (entry) => entry.law.toLowerCase().includes(q),
      'comment': (entry) => entry.comment?.toLowerCase().includes(q) || false,
      'misc': (entry) => entry.misc?.toLowerCase().includes(q) || false,
    };
    
    const filterFn = colMap[column] || colMap['all'];
    results = results.filter(filterFn);
  }
  
  return results.length;
}

// Initialize database (for MySQL mode)
export async function initDatabase() {
  if (!dbConfig.useMySQL) {
    console.log('Using CSV fallback mode');
    return;
  }
  
  const mysql = await getMySQL();
  if (!mysql) {
    throw new Error('MySQL not available');
  }
  
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
  await connection.execute(`USE ${dbConfig.database}`);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS legal_entries (
      id VARCHAR(255) PRIMARY KEY,
      year INT NOT NULL,
      volume INT NOT NULL,
      fact TEXT,
      question TEXT NOT NULL,
      judgement TEXT NOT NULL,
      law VARCHAR(50) NOT NULL,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_year (year),
      INDEX idx_volume (volume),
      INDEX idx_law (law)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.end();
  console.log('Database initialized successfully');
}

// Import CSV data to database (for MySQL mode)
export async function importCSVData(entries: LegalEntry[]) {
  if (!dbConfig.useMySQL) return;
  
  const pool = await getPool();
  if (!pool) return;
  
  await pool.execute('TRUNCATE TABLE legal_entries');
  
  const batchSize = 100;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const values = batch.map(entry => [
      entry.id, entry.year, entry.volume, entry.fact, 
      entry.question, entry.judgement, entry.law, entry.comment,
    ]);
    
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    await pool.execute(
      `INSERT INTO legal_entries (id, year, volume, fact, question, judgement, law, comment) 
       VALUES ${placeholders}`,
      values.flat()
    );
  }
  
  console.log(`Imported ${entries.length} entries to database`);
}