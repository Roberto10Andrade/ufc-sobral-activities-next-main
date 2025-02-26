'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        try {
          router.push(`/search?q=${encodeURIComponent(query)}`);
        } catch (error) {
          console.error('Erro na navegação:', error);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } catch (error) {
        console.error('Erro na navegação:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-lg" role="search">
      <div className="relative">
        <input
          type="search"
          placeholder="Pesquisar atividades..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          focus:outline-none focus:border-[var(--secondary-color)] focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-opacity-20"
          aria-label="Campo de pesquisa"
          aria-required="true"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
          >
            <path 
              fillRule="evenodd" 
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
    </form>
  );
}
