import { FileText, Monitor, Users, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

const STATS = [
  { label: 'Applied',    key: 'Applied',   icon: FileText,    color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  { label: 'Online Test',key: 'OA',        icon: Monitor,     color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-100' },
  { label: 'Interview',  key: 'Interview', icon: Users,       color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-100' },
  { label: 'Offered',    key: 'Offered',   icon: CheckCircle, color: 'text-green-600',   bg: 'bg-green-50',   border: 'border-green-100' },
  { label: 'Rejected',   key: 'Rejected',  icon: XCircle,     color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100' },
]

export default function StatsRow({ applications }) {
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
      {STATS.map(({ label, key, icon: Icon, color, bg }, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={key} 
          className={cn(
            'bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover flex flex-col gap-3',
            'relative overflow-hidden group'
          )}
        >
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300', bg, color)}>
            <Icon className='w-5 h-5' />
          </div>
          
          <div>
            <div className='text-3xl font-bold text-slate-900 tracking-tight'>{counts[key] || 0}</div>
            <div className='text-sm font-medium text-slate-500 mt-0.5'>{label}</div>
          </div>

          <div className={cn('absolute -right-2 -bottom-2 opacity-5 transition-opacity group-hover:opacity-10', color)}>
            <Icon className='w-16 h-16' />
          </div>
        </motion.div>
      ))}
    </div>
  )
}