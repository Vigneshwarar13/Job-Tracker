import { useState } from 'react'
import { Plus, X, Building2, Briefcase, Calendar, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

const empty = {
  company: '', role: '',
  date_applied: new Date().toISOString().split('T')[0],
  status: 'Applied', notes: '', reminder: ''
}

export default function AddApplicationForm({ onAdd }) {
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.company || !form.role) return
    setLoading(true)
    await onAdd(form)
    setForm(empty)
    setLoading(false)
    setIsOpen(false)
  }

  const labelCls = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1'
  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all'

  return (
    <div className='space-y-4'>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm',
          isOpen 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20'
        )}
      >
        {isOpen ? <X className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
        {isOpen ? 'Cancel' : 'Add Application'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className='overflow-hidden'
          >
            <form onSubmit={handleSubmit} className='bg-white rounded-3xl border border-slate-200 p-8 shadow-sm'>
              <div className='flex items-center gap-3 mb-8'>
                <div className='w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center'>
                  <Plus className='w-5 h-5 text-primary-600' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-slate-900'>New Application</h2>
                  <p className='text-sm text-slate-500'>Fill in the details of your job application</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='md:col-span-1'>
                  <label className={labelCls}>Company Name</label>
                  <div className='relative'>
                    <Building2 className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input name='company' value={form.company} onChange={handleChange}
                      placeholder='e.g. Google' className={cn(inputCls, 'pl-10')} required />
                  </div>
                </div>

                <div className='md:col-span-1'>
                  <label className={labelCls}>Job Role</label>
                  <div className='relative'>
                    <Briefcase className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input name='role' value={form.role} onChange={handleChange}
                      placeholder='e.g. Frontend Engineer' className={cn(inputCls, 'pl-10')} required />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select name='status' value={form.status} onChange={handleChange} className={inputCls}>
                    {['Applied','OA','Interview','Offered','Rejected'].map(s =>
                      <option key={s} value={s}>{s === 'OA' ? 'Online Test' : s === 'Offered' ? 'Selected' : s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Date Applied</label>
                  <div className='relative'>
                    <Calendar className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
                    <input type='date' name='date_applied' value={form.date_applied}
                      onChange={handleChange} className={cn(inputCls, 'pl-10')} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Reminder Date</label>
                  <div className='relative'>
                    <Calendar className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none' />
                    <input type='date' name='reminder' value={form.reminder}
                      onChange={handleChange} className={cn(inputCls, 'pl-10')} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Quick Notes</label>
                  <div className='relative'>
                    <FileText className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input name='notes' value={form.notes} onChange={handleChange}
                      placeholder='Referral from John...' className={cn(inputCls, 'pl-10')} />
                  </div>
                </div>
              </div>

              <div className='mt-8 pt-6 border-t border-slate-100 flex justify-end'>
                <button 
                  type='submit' 
                  disabled={loading}
                  className='bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all flex items-center gap-2'
                >
                  {loading ? 'Processing...' : 'Save Application'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}