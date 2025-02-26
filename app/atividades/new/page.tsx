'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ActivityForm from '../../components/ActivityForm'
import { Activity, getActivities, setActivities } from '../../data/activities'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewActivity() {
  const router = useRouter()

  const handleSubmit = async (values: Activity) => {
    try {
      const activities = getActivities()
      const newActivity = {
        ...values,
        id: Date.now().toString(),
        imageUrl: `/images/${values.type.toLowerCase()}.jpg`
      }
      activities.push(newActivity)
      setActivities(activities)
      
      router.push('/atividades')
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 opacity-80 dark:opacity-60"></div>
        
        {/* Animated circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-500 dark:border-blue-400 rounded-lg transform rotate-45"></div>
          <div className="absolute top-[20%] right-[10%] w-32 h-32 border-2 border-purple-500 dark:border-purple-400 rounded-full"></div>
          <div className="absolute bottom-[15%] left-[20%] w-24 h-24 border-2 border-indigo-500 dark:border-indigo-400 transform rotate-12"></div>
          <div className="absolute bottom-[10%] right-[15%] w-16 h-16 border-2 border-pink-500 dark:border-pink-400 rounded-full"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk5OTkiIHN0cm9rZS13aWR0aD0iMSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')] opacity-10 dark:opacity-5"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-8 pb-16">
        <div className="mb-8 flex items-center">
          <Link
            href="/atividades"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 group font-medium"
          >
            <span className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm group-hover:shadow-md transition-all duration-200 transform group-hover:scale-105">
              <ArrowLeftIcon className="w-5 h-5" />
            </span>
            <span className="group-hover:underline">Voltar para a lista</span>
          </Link>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform -rotate-1 scale-[1.03] blur-xl"></div>
          <ActivityForm onSubmit={handleSubmit} />
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Universidade Federal do Ceará - Campus Sobral</p>
          <p className="mt-1">Sistema de Gerenciamento de Atividades</p>
        </div>
      </div>
    </div>
  )
}
