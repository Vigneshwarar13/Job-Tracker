import { useState } from 'react'
import { Plus, X, Building2, Briefcase, FileText, Calendar, Clock, Target, Repeat, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import DateInput from './DateInput'
import { getTodayInput, isDateAfter } from '../lib/dateUtils'

const empty = {
  company: '', 
  role: '',
  date_applied: getTodayInput(),
  status: 'Applied', 
  notes: '', 
  reminder: '',
  interview_date: '',
  deadline_date: '',
  next_round_date: '',
  follow_up_date: ''
}

export default function AddApplicationForm({ onAdd }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }

    // Cross-field validation
    if (name === 'reminder' && value && !isDateAfter(form.date_applied, value)) {
      setErrors(prev => ({ ...prev, reminder: 'Reminder must be after application date' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Final validation
    const newErrors = {}
    if (!form.company) newErrors.company = 'Company is required'
    if (!form.role) newErrors.role = 'Role is required'
    if (form.reminder && !isDateAfter(form.date_applied, form.reminder)) {
      newErrors.reminder = 'Reminder must be after application date'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    await onAdd(form)
    setForm(empty)
    setErrors({})
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
                      placeholder='e.g. Google' className={cn(inputCls, 'pl-10', errors.company && 'border-red-300 focus:ring-red-500/20 focus:border-red-500')} required />
                  </div>
                  {errors.company && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.company}</p>}
                </div>

                <div className='md:col-span-1'>
                  <label className={labelCls}>Job Role</label>
                  <div className='relative'>
                    <Briefcase className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <input name='role' value={form.role} onChange={handleChange}
                      placeholder='e.g. Frontend Engineer' className={cn(inputCls, 'pl-10', errors.role && 'border-red-300 focus:ring-red-500/20 focus:border-red-500')} required />
                  </div>
                  {errors.role && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.role}</p>}
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select name='status' value={form.status} onChange={handleChange} className={inputCls}>
                    {['Applied','OA','Interview','Offered','Rejected'].map(s =>
                      <option key={s} value={s}>{s === 'OA' ? 'Online Test' : s === 'Offered' ? 'Selected' : s}</option>)}
                  </select>
                </div>

                <DateInput 
                  label="Applied Date" 
                  name="date_applied" 
                  value={form.date_applied} 
                  onChange={handleChange} 
                  required
                />

                <DateInput 
                  label="Reminder Date" 
                  name="reminder" 
                  value={form.reminder} 
                  onChange={handleChange}
                  error={errors.reminder}
                  icon={Clock}
                />

                <DateInput 
                  label="Interview Date" 
                  name="interview_date" 
                  value={form.interview_date} 
                  onChange={handleChange}
                  icon={Calendar}
                />

                <DateInput 
                  label="Deadline Date" 
                  name="deadline_date" 
                  value={form.deadline_date} 
                  onChange={handleChange}
                  icon={Target}
                />

                <DateInput 
                  label="Next Round Date" 
                  name="next_round_date" 
                  value={form.next_round_date} 
                  onChange={handleChange}
                  icon={Repeat}
                />

                <DateInput 
                  label="Follow-up Date" 
                  name="follow_up_date" 
                  value={form.follow_up_date} 
                  onChange={handleChange}
                  icon={MessageSquare}
                />

                <div className='md:col-span-3'>
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