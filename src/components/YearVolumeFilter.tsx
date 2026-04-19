'use client';

interface YearVolumeFilterProps {
  selectedYear: string;
  selectedVolume: string;
  onYearChange: (year: string) => void;
  onVolumeChange: (volume: string) => void;
  onClear: () => void;
}

// Data structure:
// - Section 1 (ภาค 1): Bar_Editorials_1.csv - Years 63-78
// - Section 2 (ภาค 2): Bar_Editorials_2.csv - Years 63-78
const sections = [
  { value: '1', label: 'ภาค 1 ' },
  { value: '2', label: 'ภาค 2 ' },
];

// Years available per section
const yearsBySection: Record<string, number[]> = {

  '1': [78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63],
  '2': [78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63],
};

export default function YearVolumeFilter({
  selectedYear,
  selectedVolume,
  onYearChange,
  onVolumeChange,
  onClear,
}: YearVolumeFilterProps) {
  const hasFilters = selectedYear || selectedVolume;

  // Get available years based on selected section
  const availableYears = selectedVolume 
    ? yearsBySection[selectedVolume] || yearsBySection['1']
    : [...new Set([...yearsBySection['1'], ...yearsBySection['2']])].sort((a, b) => b - a);

  const handleSectionChange = (section: string) => {
    onVolumeChange(section);
    // Reset year when section changes
    onYearChange('');
  };

  const handleYearChange = (year: string) => {
    onYearChange(year);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Section Filter (ภาค) */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          ภาค:
        </label>
        <select
          value={selectedVolume}
          onChange={(e) => handleSectionChange(e.target.value)}
          className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white min-w-[200px] md:min-w-[240px] text-sm md:text-base"
        >
          <option value="">ทุกภาค</option>
          {sections.map((section) => (
            <option key={section.value} value={section.value}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter (สมัย) */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          สมัย:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white min-w-[140px] md:min-w-[160px] text-sm md:text-base"
        >
          <option value="">ทุกสมัย</option>
          {availableYears.map((year) => (
            <option key={year} value={year.toString()}>
              สมัยที่ {year}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Button */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-2 sm:mt-0 px-3 md:px-4 py-1.5 md:py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          ล้างตัวกรอง
        </button>
      )}
    </div>
  );
}