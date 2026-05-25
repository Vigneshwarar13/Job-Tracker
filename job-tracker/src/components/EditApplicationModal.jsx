import { useState, useEffect } from 'react'
import { X, Building2, Briefcase, FileText, Calendar, Clock, Target, Repeat, MessageSquare, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import DateInput from './DateInput'
import { isDateAfter } from '../lib/dateUtils'

export default function EditApplicationModal({ app, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(app || {})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (app) setForm(app)
  }, [app])

  const handleChange = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }

    if (name === 'reminder' && value && !isDateAfter(form.date_applied, value)) {
      setErrors(prev => ({ ...prev, reminder: 'Reminder must be after application date' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
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
    await onSave(app.id, form)
    setLoading(false)
    onClose()
  }

  const labelCls = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1'
  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Edit Application</h2>
                  <p className="text-sm text-slate-500">{app.company} — {app.role}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                <div className="md:col-span-1">
                  <label className={labelCls}>Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      name="company" 
                      value={form.company} 
                      onChange={handleChange}
                      className={cn(inputCls, "pl-10", errors.company && "border-red-300")} 
                      required 
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className={labelCls}>Job Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      name="role" 
                      value={form.role} 
                      onChange={handleChange}
                      className={cn(inputCls, "pl-10", errors.role && "border-red-300")} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                    {['Applied','OA','Interview','Offered','Rejected'].map(s =>
                      <option key={s} value={s}>{s === 'OA' ? 'Online Test' : s === 'Offered' ? 'Selected' : s}</option>
                    )}
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

                <div className="md:col-span-2">
                  <label className={labelCls}>Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <textarea 
                      name="notes" 
                      value={form.notes} 
                      onChange={handleChange}
                      rows={3}
                      className={cn(inputCls, "pl-10 resize-none")} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
