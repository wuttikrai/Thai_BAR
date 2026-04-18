'use client';

import { useState } from 'react';
import { LegalEntry } from '@/types';

interface ResultCardProps {
  entry: LegalEntry;
}

const lawCategoryColors: Record<string, string> = {
  'อาญา': 'bg-red-100 text-red-800',
  'แพ่ง': 'bg-blue-100 text-blue-800',
  'วิ.อาญา': 'bg-orange-100 text-orange-800',
  'วิ.แพ่ง': 'bg-green-100 text-green-800',
};

export default function ResultCard({ entry }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const lawColor = lawCategoryColors[entry.law] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-gray-100">
        <div className="flex flex-wrap items-start justify-between gap-2 md:gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium ${lawColor}`}>
              {entry.law}
            </span>
            <span className="text-xs md:text-sm text-gray-500">
              สมัยที่ {entry.year} • ภาค {entry.volume}
            </span>
          </div>
        </div>

        {/* Question */}
        <h3 className="mt-2 md:mt-3 text-base md:text-lg font-semibold text-gray-800 leading-relaxed">
          {entry.question}
        </h3>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Fact (ข้อเท็จจริง) */}
        {entry.fact && (
          <div className="mb-3 md:mb-4">
            <h4 className="text-xs md:text-sm font-semibold text-gray-600 mb-1 md:mb-2">ข้อเท็จจริง</h4>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {isExpanded ? entry.fact : `${entry.fact.slice(0, 150)}...`}
            </p>
          </div>
        )}

        {/* Judgement (คำตอบ) */}
        <div className="mb-3 md:mb-4">
          <h4 className="text-xs md:text-sm font-semibold text-gray-600 mb-1 md:mb-2">คำตอบ</h4>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            {isExpanded ? entry.judgement : `${entry.judgement.slice(0, 250)}...`}
          </p>
        </div>

        {/* Comment (ข้อสังเกต) */}
        {entry.comment && (
          <div className="bg-amber-50 rounded-lg p-3 md:p-4 mt-3 md:mt-4">
            <h4 className="text-xs md:text-sm font-semibold text-amber-800 mb-1 md:mb-2">📝 ข้อสังเกต</h4>
            <p className="text-amber-900 leading-relaxed text-sm md:text-base">
              {isExpanded ? entry.comment : `${entry.comment.slice(0, 150)}...`}
            </p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 md:mt-4 text-[#1e3a5f] font-medium hover:underline text-xs md:text-sm"
        >
          {isExpanded ? 'ย่อลง' : 'อ่านเพิ่มเติม'}
        </button>
      </div>
    </div>
  );
}