export interface LegalEntry {
  id: string;
  year: number;
  volume: number;
  fact: string;
  question: string;
  judgement: string;
  law: string;
  comment: string;
  misc?: string;
}

export type ViewMode = 'list' | 'detailed' | 'cards';

// Law categories based on actual CSV data
export type LawCategory = 
  | 'ทั้งหมด' 
  | 'อาญา' 
  | 'แพ่ง' 
  | 'แพ่งเกี่ยวเนื่องอาญา' 
  | 'รัฐธรรมนูญ';

export interface FilterState {
  category: string;
  year: string;
  volume: string;
  searchQuery: string;
  searchColumn: string; // 'all', 'fact', 'question', 'judgement', 'law', 'comment', 'misc'
}