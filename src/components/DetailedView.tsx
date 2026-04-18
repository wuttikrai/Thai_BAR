'use client';

import { LegalEntry } from '@/types';

interface DetailedViewProps {
  results: LegalEntry[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectCase: (index: number) => void;
}

const lawCategoryColors: Record<string, string> = {
  'อาญา': 'bg-red-100 text-red-800',
  'แพ่ง': 'bg-blue-100 text-blue-800',
  'วิ.อาญา': 'bg-orange-100 text-orange-800',
  'วิ.แพ่ง': 'bg-green-100 text-green-800',
};

export default function DetailedView({ results, currentIndex, onPrevious, onNext, onSelectCase }: DetailedViewProps) {
  const entry = results[currentIndex];
  const lawColor = lawCategoryColors[entry.law] || 'bg-gray-100 text-gray-800';

  const downloadCase = () => {
    const caseText = `คำพิพากษาฎีกา
ปี: ${entry.year} | ภาค: ${entry.volume}

ข้อเท็จจริง:
${entry.fact}

คำถาม:
${entry.question}

คำตอบ:
${entry.judgement}

กฎหมายที่เกี่ยวข้อง:
${entry.law}

ข้อสังเกต:
${entry.comment || 'ไม่มี'}
${entry.misc ? `\nอื่นๆ:\n${entry.misc}` : ''}`;

    const blob = new Blob([caseText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case_y${entry.year}_v${entry.volume}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentIndex === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#1e3a5f] text-white hover:bg-[#2a4a73]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ก่อนหน้า
        </button>

        <div className="text-center">
          <span className="text-lg font-semibold text-gray-800">
            รายการ {currentIndex + 1} จาก {results.length}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={currentIndex === results.length - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentIndex === results.length - 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#1e3a5f] text-white hover:bg-[#2a4a73]'
          }`}
        >
          ถัดไป
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Case Content */}
      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${lawColor}`}>
            {entry.law}
          </span>
          <span className="text-gray-600">
            สมัยที่ {entry.year} • ภาค {entry.volume}
          </span>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">❓ คำถาม</h2>
          <p className="text-gray-700 leading-relaxed text-lg bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            {entry.question}
          </p>
        </div>

        {/* Fact */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 ข้อเท็จจริง</h3>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.fact}</p>
          </div>
        </div>

        {/* Judgement */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">⚖️ คำตอบ / คำพิพากษา</h3>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.judgement}</p>
          </div>
        </div>

        {/* Law */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📜 กฎหมายที่เกี่ยวข้อง</h3>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="text-gray-700 leading-relaxed">{entry.law}</p>
          </div>
        </div>

        {/* Comment */}
        {entry.comment && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">💬 ข้อสังเกต</h3>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.comment}</p>
            </div>
          </div>
        )}

        {/* Misc */}
        {entry.misc && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📎 อื่นๆ</h3>
            <div className="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-400">
              <p className="text-gray-700 leading-relaxed">{entry.misc}</p>
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={downloadCase}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            📥 ดาวน์โหลดรายการนี้
          </button>
        </div>
      </div>
    </div>
  );
}