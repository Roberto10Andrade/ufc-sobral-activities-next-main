import { Activity } from '@prisma/client';

interface DashboardStatsProps {
  activities: Activity[];
}

export default function DashboardStats({ activities }: DashboardStatsProps) {
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const urgentActivities = activities.filter(a => {
    const deadline = new Date(a.deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && a.status !== 'completed';
  }).length;

  const stats = [
    {
      title: 'Total de Atividades',
      value: totalActivities,
      icon: '📅',
      color: 'bg-blue-500',
    },
    {
      title: 'Atividades Concluídas',
      value: completedActivities,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Atividades Pendentes',
      value: pendingActivities,
      icon: '⏳',
      color: 'bg-yellow-500',
    },
    {
      title: 'Atividades Urgentes',
      value: urgentActivities,
      icon: '⚠️',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full flex items-center justify-center w-12 h-12`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
