'use client';

import { useState, useEffect } from 'react';
import { Activity, getActivities, deleteActivity } from '../data/activities';
import Link from 'next/link';
import ActivityList from '../components/ActivityList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState({
    type: 'ALL',
    status: 'ALL',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = () => {
      setIsLoading(true);
      const data = getActivities();
      setActivities(data);
      setIsLoading(false);
    };

    loadActivities();
    window.addEventListener('storage', loadActivities);

    return () => {
      window.removeEventListener('storage', loadActivities);
    };
  }, []);

  const handleDelete = (id: string) => {
    deleteActivity(id);
    // A lista será atualizada automaticamente pelo evento storage
  };

  const handleEdit = (id: string) => {
    // Redirecionar para a página de edição
    window.location.href = `/atividades/edit/${id}`;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter.type !== 'ALL' && activity.type !== filter.type) return false;
    if (filter.status !== 'ALL' && activity.status !== filter.status) return false;
    if (filter.startDate) {
      const activityStartDate = format(new Date(activity.startDate), 'yyyy-MM-dd');
      if (activityStartDate < filter.startDate) return false;
    }
    if (filter.endDate) {
      const activityEndDate = format(new Date(activity.endDate), 'yyyy-MM-dd');
      if (activityEndDate > filter.endDate) return false;
    }
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return (
        activity.title.toLowerCase().includes(searchTerm) ||
        activity.description.toLowerCase().includes(searchTerm) ||
        activity.coordinator.toLowerCase().includes(searchTerm) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Cabeçalho */}
          <div className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Atividades
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Gerencie todas as atividades da UFC Sobral
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/atividades/nova"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Atividade
                </Link>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                    } transition-all`}
                    title="Visualização em grade"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
                    } transition-all`}
                    title="Visualização em lista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar atividades..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="ALL">Todos os tipos</option>
                <option value="COURSE">Cursos</option>
                <option value="WORKSHOP">Workshops</option>
                <option value="SEMINAR">Seminários</option>
                <option value="RESEARCH">Pesquisa</option>
                <option value="EXTENSION">Extensão</option>
              </select>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="ALL">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Data inicial"
              />
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Data final"
              />
            </div>
          </div>

          {/* Lista de Atividades */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma atividade encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Não encontramos nenhuma atividade com os filtros selecionados. Tente ajustar os filtros ou criar uma nova atividade.
                </p>
                <Link
                  href="/atividades/nova"
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Criar Nova Atividade
                </Link>
              </div>
            ) : (
              <ActivityList
                activities={filteredActivities}
                viewMode={viewMode}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
