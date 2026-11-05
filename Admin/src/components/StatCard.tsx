
import type { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  value: string
  icon: LucideIcon
  change: string
  color: 'blue' | 'purple' | 'cyan' | 'orange'
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  color,
}: Props) {
  return (
    <div className={`admin-stat-card stat-${color}`}>
      <div className="admin-stat-icon">
        <Icon size={23} />
      </div>

      <div className="admin-stat-info">
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{change}</span>
      </div>
    </div>
  )
}
