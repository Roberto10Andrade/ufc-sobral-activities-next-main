'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import ActivityForm from '../../../components/ActivityForm'
import { Activity, getActivities, setActivities } from '../../../data/activities'

function EditActivityContent({ id }: { id: string }) {
  const router = useRouter()
  const [activity, setActivity] = useState<Activity | null>(null)

  useEffect(() => {
    const activities = getActivities()
    const foundActivity = activities.find((a: Activity) => a.id === id)
    if (foundActivity) {
      setActivity(foundActivity)
    }
  }, [id])

  const handleSubmit = async (values: Activity) => {
    try {
      const activities = getActivities()
      const updatedActivities = activities.map((a: Activity) =>
        a.id === id ? { ...values, id, imageUrl: a.imageUrl } : a
      )
      setActivities(updatedActivities)
      router.push('/atividades')
    } catch (error) {
      console.error('Error updating activity:', error)
    }
  }

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
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Atividade
            </h1>
            <Link
              href="/atividades"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              ← Voltar para a lista
            </Link>
          </div>
          <ActivityForm initialValues={activity} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default function EditActivity({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <EditActivityContent id={params.id} />
    </Suspense>
  )
}
