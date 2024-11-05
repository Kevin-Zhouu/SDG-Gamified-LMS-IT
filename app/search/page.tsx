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
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#F6F7FB]"> {/* Subtract header height */}
      <div className="w-full bg-white shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-lg font-semibold">Search SDGs and Modules</h1>
        </div>
      </div>

      <main className="flex-grow p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter search term..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="mt-3 w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <ul className="space-y-4">
                  {searchResults.map((result, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0">
                      <Link href={`/play/${result.moduleId}#section-${result.sectionId}`}>
                        <div className="hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                          <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                          <p className="text-gray-600 mb-2">{result.snippet}</p>
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <span>Module {result.moduleId}</span>
                            <span>•</span>
                            <span className="capitalize">{result.sectionType}</span>
                          </div>
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