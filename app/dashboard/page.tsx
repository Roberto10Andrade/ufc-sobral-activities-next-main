'use client'

import { useState, useEffect } from 'react'
import { Activity } from '@prisma/client'
import DashboardStats from '../components/DashboardStats'
import Calendar from '../components/Calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities')
        const data = await response.json()
        setActivities(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao carregar atividades:', error)
        setIsLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const filteredActivities = activities.filter(activity => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && activity.status === 'pending') ||
      (filter === 'completed' && activity.status === 'completed')

    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <main className="p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie e acompanhe todas as atividades da UFC Sobral
          </p>
        </motion.div>

        {/* Estatísticas */}
        {!isLoading && <DashboardStats activities={activities} />}

        {/* Barra de Pesquisa e Filtros */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Pesquisar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
              <span className="text-gray-400">📊</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
              >
                <option value="all">Todas</option>
                <option value="pending">Pendentes</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Atividades */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className={`text-sm font-medium mb-2 inline-block px-2 py-1 rounded ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {activity.status === 'completed' ? 'Concluída ✅' : 'Pendente ⏳'}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>Prazo: {format(new Date(activity.deadline), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Calendário */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Calendário de Atividades
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <Calendar activities={activities} />
          </div>
        </div>
      </div>
    </main>
  )
}
