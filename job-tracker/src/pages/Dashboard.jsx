import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import StatsRow from '../components/StatsRow'
import AddApplicationForm from '../components/AddApplicationForm'
import ApplicationTable from '../components/ApplicationTable'
import { TableSkeleton } from '../components/Skeleton'
import { Search, Calendar as CalendarIcon, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

const FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'Applied', value: 'Applied' },
  { label: 'Screening', value: 'Screening' },
  { label: 'Online Test', value: 'OA' },
  { label: 'Technical Interview', value: 'Technical Interview' },
  { label: 'Interview', value: 'Interview' },
  { label: 'Selected', value: 'Offered' },
  { label: 'Rejected', value: 'Rejected' },
]

export default function Dashboard({ session }) {
  const user = session?.user
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApps = async () => {
      const { data, error: err } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) setError(err.message)
      else setApps(data || [])
      setLoading(false)
    }
    fetchApps()
  }, [])

  const handleAdd = async (formData) => {
    const clean = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== '')
    )
    const payload = { ...clean, user_id: user?.id }
    const { data, error } = await supabase
      .from('applications').insert([payload]).select()
    if (error) alert('Error adding: ' + error.message)
    else setApps([data[0], ...apps])
  }

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('applications').update({ status: newStatus }).eq('id', id)
    if (!error)
      setApps(apps.map(a => a.id === id ? { ...a, status: newStatus } : a))
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('applications').delete().eq('id', id)
    if (!error) setApps(apps.filter(a => a.id !== id))
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = apps
    .filter(a => a.reminder && a.reminder >= today)
    .sort((a, b) => a.reminder.localeCompare(b.reminder))
    .slice(0, 3)

  const displayed = apps
    .filter(a => filter === 'All' || a.status === filter)
    .filter(a =>
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className='min-h-screen bg-slate-50/50 pb-20'>
      <Navbar user={user} />
      
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10'>
        
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className='text-4xl font-black text-slate-900 tracking-tight'>
              Dashboard
            </h1>
            <p className='text-slate-500 mt-2 text-lg'>
              Welcome back! You have <span className='font-bold text-primary-600'>{apps.length}</span> active applications.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AddApplicationForm onAdd={handleAdd} />
          </motion.div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3'
          >
            <AlertCircle className='w-5 h-5 flex-shrink-0' />
            <p className='text-sm font-medium'>{error} — Please check your connection or environment settings.</p>
          </motion.div>
        )}

        {/* Stats Section */}
        <section>
          <StatsRow applications={apps} />
        </section>

        {/* Upcoming Reminders */}
        <AnimatePresence>
          {upcoming.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-primary-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-primary-900/20 relative overflow-hidden'
            >
              <div className='absolute top-0 right-0 p-10 opacity-10 pointer-events-none'>
                <CalendarIcon className='w-40 h-40 rotate-12' />
              </div>
              
              <div className='relative z-10'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='bg-white/10 p-2 rounded-xl backdrop-blur-sm'>
                    <CalendarIcon className='w-5 h-5 text-primary-200' />
                  </div>
                  <h3 className='text-xl font-bold tracking-tight'>Upcoming Milestones</h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {upcoming.map(app => (
                    <div key={app.id} className='bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-all group'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <p className='font-bold text-lg leading-tight'>{app.company}</p>
                          <p className='text-primary-200 text-sm mt-0.5'>{app.role}</p>
                        </div>
                        <div className='bg-primary-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider'>
                          {app.status === 'OA' ? 'OA' : app.status}
                        </div>
                      </div>
                      <div className='flex items-center gap-2 text-xs text-primary-100 font-medium'>
                        <CalendarIcon className='w-3.5 h-3.5' />
                        {app.reminder}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Applications List Section */}
        <section className='space-y-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide'>
              {FILTERS.map(f => (
                <button 
                  key={f.value} 
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    'px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap',
                    filter === f.value
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300 hover:text-primary-600'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className='relative group'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors' />
              <input 
                type='text' 
                placeholder='Search company or role...'
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className='bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 w-full md:w-80 transition-all shadow-sm' 
              />
            </div>
          </div>

          <div className='relative'>
            {loading ? (
              <TableSkeleton />
            ) : (
              <ApplicationTable 
                applications={displayed} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDelete} 
              />
            )}
          </div>
        </section>

      </main>
    </div>
  )
}