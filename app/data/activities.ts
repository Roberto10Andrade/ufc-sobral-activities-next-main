export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'COURSE' | 'WORKSHOP' | 'SEMINAR' | 'RESEARCH' | 'EXTENSION' | 'OTHER';
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  time?: string;
  location: string;
  coordinator: string;
  participants: number;
  tags: string[];
  imageUrl?: string;
  updatedAt?: string;
  requirements?: string[];
}

export const defaultActivities: Activity[] = [
  {
    id: '1',
    title: 'Curso de Programação Web',
    description: 'Aprenda desenvolvimento web com HTML, CSS, JavaScript e React. Curso prático com projetos reais.',
    type: 'COURSE',
    status: 'UPCOMING',
    startDate: '2025-03-01',
    endDate: '2025-05-30',
    time: '18:30 - 22:00',
    location: 'Laboratório de Informática 1',
    coordinator: 'Prof. Carlos Silva',
    participants: 30,
    tags: ['programação', 'web', 'react', 'javascript'],
    imageUrl: '/images/web-dev.jpg',
    requirements: [
      'Conhecimentos básicos de lógica de programação',
      'Notebook próprio',
      'Disponibilidade para atividades práticas'
    ]
  },
  {
    id: '2',
    title: 'Workshop de Inteligência Artificial',
    description: 'Workshop intensivo sobre IA, Machine Learning e suas aplicações práticas.',
    type: 'WORKSHOP',
    status: 'UPCOMING',
    startDate: '2025-04-15',
    endDate: '2025-04-17',
    time: '09:00 - 17:00',
    location: 'Auditório Principal',
    coordinator: 'Profa. Ana Santos',
    participants: 50,
    tags: ['ia', 'machine learning', 'tecnologia'],
    imageUrl: '/images/ai-workshop.jpg',
    requirements: [
      'Conhecimentos de Python',
      'Noções de estatística',
      'Laptop com configuração para processamento de dados'
    ]
  },
  {
    id: '3',
    title: 'Seminário de Inovação Tecnológica',
    description: 'Discussão sobre as últimas tendências em inovação e tecnologia.',
    type: 'SEMINAR',
    status: 'COMPLETED',
    startDate: '2025-02-10',
    endDate: '2025-02-10',
    location: 'Sala de Conferências',
    coordinator: 'Prof. Roberto Lima',
    participants: 100,
    tags: ['inovação', 'tecnologia', 'tendências'],
    imageUrl: '/images/tech-innovation.jpg'
  },
  {
    id: '4',
    title: 'Projeto de Pesquisa em IoT',
    description: 'Pesquisa aplicada em Internet das Coisas para cidades inteligentes.',
    type: 'RESEARCH',
    status: 'UPCOMING',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    location: 'Laboratório de IoT',
    coordinator: 'Prof. Marcos Oliveira',
    participants: 15,
    tags: ['iot', 'pesquisa', 'cidades inteligentes'],
    imageUrl: '/images/iot-research.jpg'
  },
  {
    id: '5',
    title: 'Extensão: Programação para Jovens',
    description: 'Projeto de extensão para ensinar programação a jovens da comunidade.',
    type: 'EXTENSION',
    status: 'UPCOMING',
    startDate: '2025-03-15',
    endDate: '2025-11-30',
    location: 'Escolas Parceiras',
    coordinator: 'Profa. Maria Costa',
    participants: 200,
    tags: ['extensão', 'educação', 'programação'],
    imageUrl: '/images/youth-coding.jpg'
  },
  {
    id: '6',
    title: 'Hackathon UFC Sobral 2025',
    description: 'Competição de programação com foco em soluções para problemas locais.',
    type: 'OTHER',
    status: 'UPCOMING',
    startDate: '2025-06-20',
    endDate: '2025-06-22',
    location: 'Campus UFC Sobral',
    coordinator: 'Prof. Paulo Mendes',
    participants: 150,
    tags: ['hackathon', 'inovação', 'competição'],
    imageUrl: '/images/hackathon.jpg'
  },
  {
    id: '7',
    title: 'Curso de Ciência de Dados',
    description: 'Fundamentos de análise de dados, estatística e visualização.',
    type: 'COURSE',
    status: 'UPCOMING',
    startDate: '2025-08-01',
    endDate: '2025-11-30',
    location: 'Laboratório de Informática 2',
    coordinator: 'Profa. Lucia Santos',
    participants: 40,
    tags: ['data science', 'estatística', 'python'],
    imageUrl: '/images/data-science.jpg'
  },
  {
    id: '8',
    title: 'Workshop de Robótica',
    description: 'Hands-on com Arduino e construção de robôs básicos.',
    type: 'WORKSHOP',
    status: 'UPCOMING',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    location: 'Laboratório de Robótica',
    coordinator: 'Prof. Ricardo Alves',
    participants: 25,
    tags: ['robótica', 'arduino', 'eletrônica'],
    imageUrl: '/images/robotics.jpg'
  },
  {
    id: '9',
    title: 'Pesquisa em Computação Verde',
    description: 'Estudo sobre eficiência energética em data centers.',
    type: 'RESEARCH',
    status: 'UPCOMING',
    startDate: '2025-02-01',
    endDate: '2026-01-31',
    location: 'Laboratório de Redes',
    coordinator: 'Prof. Fernando Costa',
    participants: 10,
    tags: ['sustentabilidade', 'computação', 'energia'],
    imageUrl: '/images/green-computing.jpg'
  },
  {
    id: '10',
    title: 'Extensão: Inclusão Digital',
    description: 'Projeto para promover inclusão digital na terceira idade.',
    type: 'EXTENSION',
    status: 'UPCOMING',
    startDate: '2025-04-01',
    endDate: '2025-10-31',
    location: 'Centro Comunitário',
    coordinator: 'Profa. Sandra Lima',
    participants: 80,
    tags: ['inclusão digital', 'terceira idade', 'extensão'],
    imageUrl: '/images/digital-inclusion.jpg'
  }
];

export function getActivities(): Activity[] {
  if (typeof window === 'undefined') return defaultActivities;
  
  const storedActivities = localStorage.getItem('activities');
  if (!storedActivities) {
    localStorage.setItem('activities', JSON.stringify(defaultActivities));
    return defaultActivities;
  }
  
  return JSON.parse(storedActivities);
}

export function setActivities(activities: Activity[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('activities', JSON.stringify(activities));
}

export function deleteActivity(id: string): void {
  const activities = getActivities();
  const updatedActivities = activities.filter(activity => activity.id !== id);
  localStorage.setItem('activities', JSON.stringify(updatedActivities));
  // Dispara um evento para notificar outras partes da aplicação
  window.dispatchEvent(new Event('storage'));
}

export function updateActivity(id: string, updatedActivity: Partial<Activity>): void {
  const activities = getActivities();
  const activityIndex = activities.findIndex(activity => activity.id === id);
  
  if (activityIndex !== -1) {
    activities[activityIndex] = {
      ...activities[activityIndex],
      ...updatedActivity,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('activities', JSON.stringify(activities));
    // Dispara um evento para notificar outras partes da aplicação
    window.dispatchEvent(new Event('storage'));
  }
}
