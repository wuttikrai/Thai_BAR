'use client';

import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onColumnChange?: (column: string) => void;
  initialValue?: string;
  initialColumn?: string;
}

const searchColumns = [
  { value: 'all', label: 'ทุกฟิลด์' },
  { value: 'fact', label: 'ข้อเท็จจริง' },
  { value: 'question', label: 'คำถาม' },
  { value: 'judgement', label: 'คำตอบ' },
  { value: 'law', label: 'กฎหมาย' },
  { value: 'comment', label: 'ข้อสังเกต' },
  { value: 'misc', label: 'อื่นๆ' },
];

export default function SearchBar({ onSearch, onColumnChange, initialValue = '', initialColumn = 'all' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [column, setColumn] = useState(initialColumn);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleColumnChange = (newColumn: string) => {
    setColumn(newColumn);
    if (onColumnChange) {
      onColumnChange(newColumn);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg 
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="text"
          placeholder="ค้นหาคำพิพากษาฎีกา..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 md:pl-12 pr-10 md:pr-4 py-3 md:py-4 text-base md:text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all duration-200 bg-white"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Column Selector */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 self-center">ค้นหาใน:</span>
        {searchColumns.map((col) => (
          <button
            key={col.value}
            onClick={() => handleColumnChange(col.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              column === col.value
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {col.label}
          </button>
        ))}
      </div>
    </div>
  );
}