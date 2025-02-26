'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { 
  CalendarIcon, 
  UserIcon, 
  MapPinIcon, 
  TagIcon 
} from '@heroicons/react/24/outline';

export default function ActivityList({ activities, viewMode = 'grid', onDelete, onEdit }) {
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
  };

  const handleDeleteConfirm = () => {
    if (activityToDelete && onDelete) {
      onDelete(activityToDelete.id);
      setActivityToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setActivityToDelete(null);
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'COURSE':
        return '📚';
      case 'WORKSHOP':
        return '🛠️';
      case 'SEMINAR':
        return '🎯';
      case 'RESEARCH':
        return '🔬';
      case 'EXTENSION':
        return '🤝';
      default:
        return '📌';
    }
  };

  const getActivityTypeGradient = (type) => {
    switch (type) {
      case 'COURSE':
        return 'from-blue-500 to-indigo-600';
      case 'WORKSHOP':
        return 'from-purple-500 to-violet-600';
      case 'SEMINAR':
        return 'from-emerald-500 to-teal-600';
      case 'RESEARCH':
        return 'from-amber-500 to-orange-600';
      case 'EXTENSION':
        return 'from-rose-500 to-pink-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Agendada
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Em Andamento
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Concluída
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    const typeLabels = {
      'COURSE': 'Curso',
      'WORKSHOP': 'Workshop',
      'SEMINAR': 'Seminário',
      'RESEARCH': 'Pesquisa',
      'EXTENSION': 'Extensão',
    };
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
        {typeLabels[type] || type}
      </span>
    );
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 animate-fadeIn">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma atividade encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tente ajustar os filtros ou criar uma nova atividade.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4 animate-fadeIn">
        {activities.map((activity) => (
          <Link 
            href={`/atividades/${activity.id}`}
            key={activity.id} 
            className="block bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
            onMouseEnter={() => setHoveredCard(activity.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex flex-col sm:flex-row">
              <div className={`w-full sm:w-2 bg-gradient-to-b ${getActivityTypeGradient(activity.type)}`}></div>
              <div className="flex-1 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(activity.status)}
                      {getTypeBadge(activity.type)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {activity.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(activity.startDate), 'PP', { locale: ptBR })}
                      </div>
                      {activity.coordinator && (
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {activity.coordinator}
                        </div>
                      )}
                      {activity.location && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {activity.location}
                        </div>
                      )}
                    </div>
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {activity.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {activity.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            +{activity.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {activities.map((activity) => (
        <Link 
          href={`/atividades/${activity.id}`}
          key={activity.id} 
          className="group bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:border-blue-300 dark:hover:border-blue-700"
          onMouseEnter={() => setHoveredCard(activity.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={`h-3 w-full bg-gradient-to-r ${getActivityTypeGradient(activity.type)}`}></div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {getStatusBadge(activity.status)}
                {getTypeBadge(activity.type)}
              </div>
              <div className="text-2xl" aria-hidden="true">
                {getActivityTypeIcon(activity.type)}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {activity.title}
            </h3>
            
            <div className="mt-auto space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(new Date(activity.startDate), 'PPP', { locale: ptBR })}
              </div>
              
              {activity.coordinator && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {activity.coordinator}
                </div>
              )}
              
              {activity.location && (
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {activity.location}
                </div>
              )}
            </div>
            
            {activity.tags && activity.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {activity.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {activity.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    +{activity.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
      
      {activityToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!activityToDelete}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Excluir Atividade"
          message={`Tem certeza que deseja excluir a atividade "${activityToDelete.title}"? Esta ação não pode ser desfeita.`}
        />
      )}
    </div>
  );
}
