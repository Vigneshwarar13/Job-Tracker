import { cn } from '../lib/utils'

const styles = {
  Applied:   'bg-blue-50 text-blue-700 ring-blue-600/20',
  OA:        'bg-purple-50 text-purple-700 ring-purple-600/20',
  Interview: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  Offered:   'bg-green-50 text-green-700 ring-green-600/20',
  Rejected:  'bg-red-50 text-red-700 ring-red-600/20',
}

const labels = {
  Applied: 'Applied',
  OA: 'Online Test',
  Interview: 'Interview',
  Offered: 'Selected',
  Rejected: 'Rejected',
}

export default function StatusBadge({ status }) {
  const cls = styles[status] || 'bg-slate-50 text-slate-700 ring-slate-600/20'
  const label = labels[status] || status

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
      cls
    )}>
      {label}
    </span>
  )
}