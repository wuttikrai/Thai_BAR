'use client';

import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

// Law categories based on actual CSV data - 4 main laws plus others
const lawCategories = [
  { value: 'ทั้งหมด', label: 'ทั้งหมด', color: 'bg-gray-600' },
  { value: 'อาญา', label: 'กฎหมายอาญา', color: 'bg-red-600' },
  { value: 'แพ่ง', label: 'กฎหมายแพ่ง', color: 'bg-blue-600' },
  { value: 'วิ.อาญา', label: 'วิธีพิจารณาคดีอาญา', color: 'bg-orange-600' },
  { value: 'วิ.แพ่ง', label: 'วิธีพิจารณาคดีแพ่ง', color: 'bg-green-600' },
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">กฎหมาย</h3>
      <div className="flex flex-wrap gap-2">
        {lawCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => onChange(category.value)}
            className={`
              px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200
              ${selected === category.value 
                ? `${category.color} text-white` 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}