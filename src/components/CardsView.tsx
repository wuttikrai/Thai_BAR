'use client';

import { LegalEntry } from '@/types';

interface CardsViewProps {
  results: LegalEntry[];
  onSelectCase: (index: number) => void;
}

const lawCategoryColors: Record<string, string> = {
  'อาญา': 'bg-red-100 text-red-800',
  'แพ่ง': 'bg-blue-100 text-blue-800',
  'วิ.อาญา': 'bg-orange-100 text-orange-800',
  'วิ.แพ่ง': 'bg-green-100 text-green-800',
};

export default function CardsView({ results, onSelectCase }: CardsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {results.map((entry, index) => {
        const lawColor = lawCategoryColors[entry.law] || 'bg-gray-100 text-gray-800';
        const factPreview = entry.fact.length > 150 
          ? `${entry.fact.slice(0, 150)}...` 
          : entry.fact;

        return (
          <div 
            key={entry.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectCase(index)}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lawColor}`}>
                {entry.law}
              </span>
              <span className="text-xs text-gray-500">
                สมัยที่ {entry.year} • ภาค {entry.volume}
              </span>
            </div>

            {/* Question Preview */}
            <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
              {entry.question}
            </h3>

            {/* Fact Preview */}
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {factPreview}
            </p>

            {/* View Button */}
            <button className="w-full py-2 text-sm font-medium text-[#1e3a5f] bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              ดูรายละเอียด →
            </button>
          </div>
        );
      })}
    </div>
  );
}