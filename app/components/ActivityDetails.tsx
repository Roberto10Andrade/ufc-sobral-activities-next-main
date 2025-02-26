'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, getActivities, deleteActivity } from '../data/activities';
import { CalendarIcon, MapPinIcon, UserGroupIcon, UserIcon, ClockIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface ActivityDetailsProps {
  id: string;
}

export default function ActivityDetails({ id }: ActivityDetailsProps) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const router = useRouter();

  useEffect(() => {
    const activities = getActivities();
    const foundActivity = activities.find(a => a.id === id);
    setActivity(foundActivity || null);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      deleteActivity(id);
      router.push('/atividades');
    }
  };

  const handleEdit = () => {
    router.push(`/atividades/edit/${id}`);
  };

  const getActivityTypeIcon = (type: string) => {
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

  const getActivityTypeGradient = (type: string) => {
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

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-6xl">😕</p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Atividade não encontrada
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            A atividade que você está procurando não existe ou foi removida.
          </p>
          <Link
            href="/atividades"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Voltar para a lista
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-br ${getActivityTypeGradient(activity.type)} h-48 flex items-center justify-center relative`}>
        <span className="text-8xl">{getActivityTypeIcon(activity.type)}</span>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="p-8">
        <div className="flex flex-col gap-6">
          {/* Cabeçalho */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {activity.title}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:text-red-400 dark:bg-red-900/50 dark:hover:bg-red-900 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Excluir
                </button>
                <Link
                  href="/atividades"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Voltar
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {activity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100/80 text-gray-800 dark:bg-gray-700/80 dark:text-gray-200 backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <UserIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Coordenador</div>
                  <div className="font-medium">{activity.coordinator}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <MapPinIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Local</div>
                  <div className="font-medium">{activity.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <UserGroupIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Participantes</div>
                  <div className="font-medium">{activity.participants} pessoas</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CalendarIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Data</div>
                  <div className="font-medium">
                    {format(new Date(activity.startDate), "dd 'de' MMMM", { locale: ptBR })} - {format(new Date(activity.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <ClockIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Horário</div>
                  <div className="font-medium">{activity.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <DocumentTextIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                  <div className="font-medium">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {activity.status === 'ACTIVE' ? 'Ativa' : 'Em breve'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sobre a atividade
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>

          {/* Requisitos ou informações adicionais */}
          {activity.requirements && activity.requirements.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Requisitos
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {activity.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
