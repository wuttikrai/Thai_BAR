'use client';

import { LegalEntry } from '@/types';

interface StatisticsProps {
  results: LegalEntry[];
  totalCount: number;
}

export default function Statistics({ results, totalCount }: StatisticsProps) {
  // Calculate statistics
  const years = [...new Set(results.map(r => r.year))].sort((a, b) => b - a);
  const volumes = [...new Set(results.map(r => r.volume))].sort((a, b) => a - b);
  const lawCounts = results.reduce((acc, r) => {
    acc[r.law] = (acc[r.law] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Data completeness
  const fields = ['fact', 'question', 'judgement', 'law', 'comment'];
  const completeness = fields.map(field => {
    const filled = results.filter(r => {
      const value = r[field as keyof LegalEntry];
      return value !== undefined && value !== null && value !== '';
    }).length;
    return {
      field,
      filled,
      percentage: results.length > 0 ? Math.round((filled / results.length) * 100) : 0,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 สถิติ</h3>

      {/* Basic Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
          <div className="text-xs text-gray-600">รายการทั้งหมด</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{years.length}</div>
          <div className="text-xs text-gray-600">ปีที่มีข้อมูล</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{volumes.length}</div>
          <div className="text-xs text-gray-600">ภาคที่มีข้อมูล</div>
        </div>
      </div>

      {/* Year Range */}
      {years.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">ช่วงปี:</div>
          <div className="text-sm font-medium text-gray-800">
            สมัยที่ {Math.min(...years)} - สมัยที่ {Math.max(...years)}
          </div>
        </div>
      )}

      {/* Law Distribution */}
      {Object.keys(lawCounts).length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">กฎหมาย:</div>
          <div className="space-y-2">
            {Object.entries(lawCounts).map(([law, count]) => (
              <div key={law} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{law}</span>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Completeness */}
      <div>
        <div className="text-sm text-gray-600 mb-2">ความสมบูรณ์ของข้อมูล:</div>
        <div className="space-y-2">
          {completeness.map(({ field, filled, percentage }) => (
            <div key={field}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 capitalize">{field}</span>
                <span className="text-gray-500">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}