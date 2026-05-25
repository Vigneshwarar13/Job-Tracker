import { Trash2, Calendar, Inbox, MoreVertical, Clock, Target, Repeat, MessageSquare, AlertCircle, Edit2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateDisplay, isDateToday, isDatePast, isDateFuture } from '../lib/dateUtils'
import { cn } from '../lib/utils'

export default function ApplicationTable({ applications, onStatusChange, onDelete, onEdit }) {
  if (applications.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm'
      >
        <div className='w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6'>
          <Inbox className='w-10 h-10 text-slate-300' />
        </div>
        <h3 className='text-xl font-bold text-slate-900 mb-2'>No applications found</h3>
        <p className='text-slate-500 max-w-xs mx-auto'>
          Start tracking your career journey by adding your first job application.
        </p>
      </motion.div>
    )
  }

  const STATUSES = ['Applied', 'OA', 'Interview', 'Offered', 'Rejected']

  const DateChip = ({ date, icon: Icon, label, color = 'blue' }) => {
    if (!date) return null
    
    const today = isDateToday(date)
    const past = isDatePast(date)
    const future = isDateFuture(date)

    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-100',
      orange: 'bg-orange-50 text-orange-700 border-orange-100',
      red: 'bg-red-50 text-red-700 border-red-100',
      green: 'bg-green-50 text-green-700 border-green-100',
      amber: 'bg-amber-50 text-amber-700 border-amber-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-100',
    }

    return (
      <div className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight border transition-all',
        today ? 'bg-primary-600 text-white border-primary-700 shadow-sm scale-105' : 
        past ? colors.red : colors[color]
      )} title={`${label}: ${formatDateDisplay(date)}`}>
        <Icon className={cn('w-3 h-3', today ? 'text-white' : '')} />
        <span>{formatDateDisplay(date)}</span>
        {today && <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
      </div>
    )
  }

  return (
    <div className='bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-slate-50/50 border-b border-slate-200'>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Company & Role</th>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Status</th>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Milestones</th>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Notes</th>
              <th className='px-6 py-4 text-right'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            <AnimatePresence mode='popLayout'>
              {applications.map((app, index) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={app.id} 
                  className='hover:bg-slate-50/80 transition-all group'
                >
                  <td className='px-6 py-5'>
                    <div>
                      <div className='font-bold text-slate-900 group-hover:text-primary-600 transition-colors'>{app.company}</div>
                      <div className='text-sm text-slate-500'>{app.role}</div>
                      <div className='mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider'>
                        <Calendar className='w-3 h-3' />
                        Applied {formatDateDisplay(app.date_applied)}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    <div className='flex items-center gap-3 relative'>
                      <StatusBadge status={app.status} />
                      <select 
                        value={app.status}
                        onChange={e => onStatusChange(app.id, e.target.value)}
                        className='opacity-0 group-hover:opacity-100 transition-opacity absolute w-24 h-8 cursor-pointer z-10'
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    <div className='flex flex-wrap gap-2 max-w-[300px]'>
                      <DateChip date={app.reminder} icon={Clock} label="Reminder" color="orange" />
                      <DateChip date={app.interview_date} icon={Calendar} label="Interview" color="purple" />
                      <DateChip date={app.deadline_date} icon={Target} label="Deadline" color="red" />
                      <DateChip date={app.next_round_date} icon={Repeat} label="Next Round" color="amber" />
                      <DateChip date={app.follow_up_date} icon={MessageSquare} label="Follow-up" color="green" />
                      
                      {!app.reminder && !app.interview_date && !app.deadline_date && !app.next_round_date && !app.follow_up_date && (
                        <span className='text-slate-300 text-xs italic'>No milestones set</span>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    <p className='text-sm text-slate-500 max-w-[200px] truncate' title={app.notes}>
                      {app.notes || <span className='text-slate-300'>—</span>}
                    </p>
                  </td>
                  <td className='px-6 py-5 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button 
                        onClick={() => onEdit(app)}
                        className='p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all opacity-0 group-hover:opacity-100'
                        title="Edit Application"
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>
                      <button 
                        onClick={() => onDelete(app.id)}
                        className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100'
                        title="Delete Application"
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
