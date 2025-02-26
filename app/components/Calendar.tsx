'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CalendarProps {
  activities: any[]
}

export default function Calendar({ activities }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const startingDayIndex = firstDayOfMonth.getDay()

  // Get the number of days in the current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  // Create calendar grid
  const days = []
  for (let i = 0; i < startingDayIndex; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
  }

  // Get activities for the selected date
  const getActivitiesForDate = (date: Date) => {
    return activities.filter(activity => {
      const activityDate = parseISO(activity.date)
      return (
        activityDate.getDate() === date.getDate() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--primary-color)]">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-24" />
          }

          const dateActivities = getActivitiesForDate(date)
          const isSelected = selectedDate?.getTime() === date.getTime()

          return (
            <div
              key={date.getTime()}
              className={`h-24 border rounded-lg p-1 cursor-pointer transition-all hover:border-[var(--secondary-color)] ${
                isSelected ? 'border-[var(--secondary-color)] bg-[var(--secondary-color)] bg-opacity-10' : ''
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-right text-sm mb-1">{date.getDate()}</div>
              <div className="space-y-1">
                {dateActivities.map((activity, i) => (
                  <div
                    key={activity.id}
                    className="text-xs p-1 rounded bg-[var(--primary-color)] text-white truncate"
                    title={activity.name}
                  >
                    {activity.name}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium mb-2">
            Atividades em {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}:
          </h3>
          <div className="space-y-2">
            {getActivitiesForDate(selectedDate).map(activity => (
              <div
                key={activity.id}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium">{activity.name}</div>
                <div className="text-sm text-gray-600">{activity.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
