import ActivityDetails from '../../components/ActivityDetails'

export default function ActivityPage({ params }: { params: { id: string } }) {
  return <ActivityDetails id={params.id} />
}
