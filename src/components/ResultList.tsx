'use client';

import { LegalEntry } from '@/types';
import ResultCard from './ResultCard';

interface ResultListProps {
  results: LegalEntry[];
  totalCount: number;
}

export default function ResultList({ results, totalCount }: ResultListProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          ผลการค้นหา
        </h2>
        <span className="text-xs md:text-sm text-gray-500">
          พบ {totalCount} รายการ
        </span>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-white rounded-lg border border-gray-100">
          <svg 
            className="w-12 md:w-16 h-12 md:h-16 mx-auto text-gray-300 mb-3 md:4"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-gray-500 text-base md:text-lg">ไม่พบผลการค้นหา</p>
          <p className="text-gray-400 text-xs md:text-sm mt-1">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {results.map((entry) => (
            <ResultCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}