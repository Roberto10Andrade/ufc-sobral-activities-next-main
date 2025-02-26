'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity, getActivities } from '../data/activities';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [searchResults, setSearchResults] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function searchActivities() {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // Obter atividades do localStorage
      const activities = getActivities();
      
      // Simular delay de pesquisa
      setTimeout(() => {
        const results = activities.filter(activity => {
          const searchQuery = query.toLowerCase();
          return (
            activity.title.toLowerCase().includes(searchQuery) ||
            activity.description.toLowerCase().includes(searchQuery) ||
            activity.coordinator.toLowerCase().includes(searchQuery) ||
            activity.tags.some(tag => tag.toLowerCase().includes(searchQuery))
          );
        });
        
        setSearchResults(results);
        setLoading(false);
      }, 500);
    }

    searchActivities();
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Resultados da Pesquisa
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {query ? `Mostrando resultados para "${query}"` : 'Nenhuma pesquisa realizada'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((activity) => (
            <div key={activity.id} className="activity-card">
              {activity.imageUrl && (
                <div className="relative h-48 mb-4 rounded-t-lg overflow-hidden">
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`badge ${
                    activity.status === 'COMPLETED' ? 'badge-success' :
                    activity.status === 'IN_PROGRESS' ? 'badge-warning' :
                    activity.status === 'CANCELLED' ? 'badge-error' :
                    ''
                  }`}>
                    {activity.status.replace('_', ' ')}
                  </span>
                  <span className="badge">{activity.type}</span>
                </div>
                <h3 className="activity-header">{activity.title}</h3>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span>👥 {activity.participants} participantes</span>
                  <span>📍 {activity.location}</span>
                </div>
                <div className="activity-footer">
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag, index) => (
                      <span key={index} className="badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma atividade encontrada para sua pesquisa.
          </p>
        </div>
      )}
    </div>
  );
}
