'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, isAfter, isBefore, isToday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Activity } from './data/activities'

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  })

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('activities')
      const storedActivities: Activity[] = storedData ? JSON.parse(storedData) : []
      
      // Validate each activity has required fields
      const validActivities = storedActivities.filter((activity): activity is Activity => {
        return (
          activity &&
          typeof activity === 'object' &&
          'id' in activity &&
          'title' in activity &&
          'startDate' in activity &&
          'endDate' in activity &&
          'status' in activity &&
          'type' in activity
        )
      })

      setActivities(validActivities)

      // Calculate statistics
      setStats({
        total: validActivities.length,
        pending: validActivities.filter(a => a.status === 'PENDING').length,
        inProgress: validActivities.filter(a => a.status === 'IN_PROGRESS').length,
        completed: validActivities.filter(a => a.status === 'COMPLETED').length,
        cancelled: validActivities.filter(a => a.status === 'CANCELLED').length,
      })
    } catch (error) {
      console.error('Error loading activities:', error)
      setActivities([])
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'UPCOMING': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente'
      case 'IN_PROGRESS': return 'Em Andamento'
      case 'COMPLETED': return 'Concluída'
      case 'CANCELLED': return 'Cancelada'
      case 'UPCOMING': return 'Próxima'
      case 'ACTIVE': return 'Ativa'
      default: return status
    }
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color-dark)] p-8 text-white mb-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Gerenciador de Atividades</h1>
          <p className="text-lg opacity-90 mb-6">Organize suas atividades acadêmicas de forma eficiente</p>
          <Link
            href="/atividades/new"
            className="inline-flex items-center space-x-2 bg-[var(--primary-color)] text-[var(--primary-color-text)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-color-dark)] hover:text-[var(--primary-color-text-dark)] transition-all duration-200 shadow-lg hover:shadow-xl button-shine"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Criar Nova Atividade</span>
          </Link>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75m-18 0A2.25 2.25 0 015.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9 0h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total de Atividades</p>
              <h3 className="text-3xl font-bold">{stats.total}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75m-18 0A2.25 2.25 0 015.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9 0h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pendentes</p>
              <h3 className="text-3xl font-bold">{stats.pending}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Em Progresso</p>
              <h3 className="text-3xl font-bold">{stats.inProgress}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Concluídas</p>
              <h3 className="text-3xl font-bold">{stats.completed}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Atividades Recentes</h2>
              <Link
                href="/atividades"
                className="text-[var(--primary-color)] hover:text-[var(--primary-color-dark)] transition-colors duration-200"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <Link href={`/atividades/${activity.id}`} key={activity.id} className="block">
                  <div className="p-4 rounded-lg bg-[var(--background-color)] hover:bg-[var(--card-background)] transition-colors duration-200 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{activity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                    <div className="text-sm opacity-75">
                      <p>Data de Início: {format(parseISO(activity.startDate), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}</p>
                      <p>Data de Término: {format(parseISO(activity.endDate), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75m-18 0A2.25 2.25 0 015.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <p className="text-lg font-medium">Nenhuma atividade encontrada</p>
                  <p className="mt-2">Comece criando uma nova atividade!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Ações Rápidas</h2>
            <div className="space-y-4">
              <Link
                href="/atividades/new"
                className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="p-3 mr-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Nova Atividade</h3>
                  <p className="text-sm text-white/80">Criar uma nova atividade</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
              
              <Link
                href="/atividades"
                className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="p-3 mr-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Listar Atividades</h3>
                  <p className="text-sm text-white/80">Ver todas as atividades</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
              
              <Link
                href="/search"
                className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="p-3 mr-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Pesquisar</h3>
                  <p className="text-sm text-white/80">Buscar atividades</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
              
              <Link
                href="/atividades?status=UPCOMING"
                className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="p-3 mr-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75m-18 0A2.25 2.25 0 015.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Próximas</h3>
                  <p className="text-sm text-white/80">Ver atividades futuras</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
