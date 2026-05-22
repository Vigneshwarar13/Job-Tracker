import { Trash2, Calendar, Inbox, MoreVertical } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { motion, AnimatePresence } from 'framer-motion'

export default function ApplicationTable({ applications, onStatusChange, onDelete }) {
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

  return (
    <div className='bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-slate-50/50 border-b border-slate-200'>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Company & Role</th>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Date Applied</th>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Status</th>
              <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Next Reminder</th>
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
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    <div className='flex items-center gap-2 text-sm text-slate-600'>
                      <Calendar className='w-4 h-4 text-slate-400' />
                      {new Date(app.date_applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                      <button className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded text-slate-400'>
                        <MoreVertical className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                  <td className='px-6 py-5'>
                    {app.reminder ? (
                      <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100'>
                        <Calendar className='w-3.5 h-3.5' />
                        {app.reminder}
                      </div>
                    ) : (
                      <span className='text-slate-300 text-sm'>—</span>
                    )}
                  </td>
                  <td className='px-6 py-5'>
                    <p className='text-sm text-slate-500 max-w-[200px] truncate' title={app.notes}>
                      {app.notes || <span className='text-slate-300'>No notes</span>}
                    </p>
                  </td>
                  <td className='px-6 py-5 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button 
                        onClick={() => onDelete(app.id)}
                        className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100'
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