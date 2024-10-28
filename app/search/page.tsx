// TODO: FIX

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface SearchResult {
  sectionId: string;
  moduleId: number;
  title: string;
  snippet: string;
  sectionType: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    };
    fetchUserData();
  }, [supabase, router]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
  
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while searching');
      }

      if (Array.isArray(data)) {
        setSearchResults(data);
      } else if (data.message) {
        setSearchResults([]);
        setError(data.message);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[16px] leading-[26px] bg-[#F6F7FB]">
      <header className="sticky top-0 z-[901] h-16 bg-white">
        <div className="h-full px-6 flex items-center justify-between">
          <span className="text-lg font-semibold">Search SDGs and Modules</span>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term..."
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {searchResults.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <ul className="space-y-4">
                  {searchResults.map((result, index) => (
                    <li key={index} className="border-b pb-2">
                      <Link href={`/play/${result.moduleId}#section-${result.sectionId}`}>
                        <div className="hover:bg-gray-100 p-2 rounded">
                          <h3 className="font-semibold">{result.title}</h3>
                          <p className="text-sm text-gray-600">{result.snippet}</p>
                          <span className="text-xs text-blue-500">
                            Module {result.moduleId} • {result.sectionType}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;