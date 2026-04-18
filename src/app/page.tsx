'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LegalEntry, FilterState, ViewMode } from '@/types';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import YearVolumeFilter from '@/components/YearVolumeFilter';
import ResultList from '@/components/ResultList';
import DetailedView from '@/components/DetailedView';
import CardsView from '@/components/CardsView';
import Statistics from '@/components/Statistics';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'ทั้งหมด',
    year: '',
    volume: '',
    searchQuery: '',
    searchColumn: 'all',
  });

  const [results, setResults] = useState<LegalEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch data from API - using ref to get latest filters
  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Use ref to get current filter values
    const currentFilters = filtersRef.current;

    try {
      const params = new URLSearchParams();
      if (currentFilters.category !== 'ทั้งหมด') params.set('category', currentFilters.category);
      if (currentFilters.year) params.set('year', currentFilters.year);
      if (currentFilters.volume) params.set('volume', currentFilters.volume);
      if (currentFilters.searchQuery) params.set('q', currentFilters.searchQuery);
      if (currentFilters.searchColumn && currentFilters.searchColumn !== 'all') params.set('column', currentFilters.searchColumn);

      const response = await fetch(`/api/legal?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      
      // Handle both API response and fallback data
      if (data.data) {
        setResults(data.data);
        setTotalCount(data.total);
      } else if (Array.isArray(data)) {
        setResults(data);
        setTotalCount(data.length);
      }
    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps - filters accessed via ref

  // Store filters in ref for use in callback
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Initial load
  useEffect(() => {
    fetchResults();
  }, []); // Only run once on mount

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.category, filters.year, filters.volume, filters.searchQuery, filters.searchColumn]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleSearchColumnChange = (column: string) => {
    setFilters(prev => ({ ...prev, searchColumn: column }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleYearChange = (year: string) => {
    setFilters(prev => ({ ...prev, year }));
  };

  const handleVolumeChange = (volume: string) => {
    setFilters(prev => ({ ...prev, volume }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'ทั้งหมด',
      year: '',
      volume: '',
      searchQuery: '',
      searchColumn: 'all',
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < results.length - 1) setCurrentIndex(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-6 md:py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            ระบบค้นหาคำพิพากษาฎีกา
          </h1>
          <p className="text-gray-300 text-sm md:text-lg">
            ค้นหาข้อมูลทางกฎหมาย อาญา แพ่ง วิธีพิจารณาความอาญา วิธีพิจารณาความแพ่ง
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch} 
          onColumnChange={handleSearchColumnChange}
          initialValue={filters.searchQuery}
          initialColumn={filters.searchColumn}
        />

        {/* Category Filters */}
        <div className="mt-5 md:mt-6">
          <CategoryFilter 
            selected={filters.category} 
            onChange={handleCategoryChange} 
          />
        </div>

        {/* Year and Volume Filters */}
        <div className="mt-4">
          <YearVolumeFilter 
            selectedYear={filters.year}
            selectedVolume={filters.volume}
            onYearChange={handleYearChange}
            onVolumeChange={handleVolumeChange}
            onClear={clearFilters}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">กำลังค้นหา...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchResults}
              className="mt-2 text-red-700 underline text-sm"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-6 md:mt-8">
            {/* View Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="text-sm text-gray-600">
                แสดง <span className="font-semibold">{results.length}</span> จาก <span className="font-semibold">{totalCount}</span> รายการ
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">รูปแบบ:</span>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => { setViewMode('list'); setCurrentIndex(0); }}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-[#1e3a5f] text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    📋 รายการ
                  </button>
                  <button
                    onClick={() => { setViewMode('detailed'); setCurrentIndex(0); }}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === 'detailed' 
                        ? 'bg-[#1e3a5f] text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    📖 อ่านต่อเนื่อง
                  </button>
                  <button
                    onClick={() => { setViewMode('cards'); setCurrentIndex(0); }}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === 'cards' 
                        ? 'bg-[#1e3a5f] text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🃏 การ์ด
                  </button>
                </div>
              </div>
            </div>

            {/* Render based on view mode */}
            {viewMode === 'list' && <ResultList results={results} totalCount={totalCount} />}
            {viewMode === 'detailed' && (
              <DetailedView 
                results={results} 
                currentIndex={currentIndex}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSelectCase={setCurrentIndex}
              />
            )}
            {viewMode === 'cards' && (
              <CardsView 
                results={results} 
                onSelectCase={(index) => { setViewMode('detailed'); setCurrentIndex(index); }}
              />
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && results.length === 0 && (
          <div className="mt-8 text-center py-12 bg-white rounded-lg border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">ไม่พบผลการค้นหา</p>
            <p className="text-gray-400 text-sm mt-1">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-5 md:py-6 mt-8 md:mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2026 ระบบค้นหาคำพิพากษาฎีกา | สำหรับนักศึกษากฎหมาย</p>
        </div>
      </footer>
    </main>
  );
}