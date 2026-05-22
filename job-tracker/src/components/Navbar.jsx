import { Briefcase, Bell, User, Search, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Navbar({ user }) {
  return (
    <nav className='sticky top-0 z-50 w-full glass border-b border-slate-200/60'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary-600 p-2 rounded-xl'>
              <Briefcase className='w-6 h-6 text-white' />
            </div>
            <span className='font-bold text-slate-900 text-xl tracking-tight'>JobTracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className='pl-10 pr-4 py-1.5 bg-slate-100/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500/20 w-64 transition-all outline-none'
              />
            </div>
            
            <div className='h-6 w-px bg-slate-200'></div>
            
            <button className='p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative'>
              <Bell className='w-5 h-5' />
              <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>
            </button>
            
            <div className='flex items-center gap-3 pl-2'>
              <div className='text-right hidden sm:block'>
                <p className='text-xs font-semibold text-slate-900'>{user?.email?.split('@')[0]}</p>
                <p className='text-[10px] text-slate-500 truncate max-w-[120px]'>{user?.email}</p>
              </div>
              <div className='w-9 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden'>
                <User className='w-5 h-5 text-slate-600' />
              </div>
            </div>

            <button 
              onClick={() => supabase.auth.signOut()}
              className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all'
              title="Log Out"
            >
              <LogOut className='w-5 h-5' />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className='flex md:hidden items-center gap-2'>
            <div className='w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden' title={user?.email}>
              <User className='w-4.5 h-4.5 text-slate-600' />
            </div>
            <button 
              onClick={() => supabase.auth.signOut()}
              className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all'
              title="Log Out"
            >
              <LogOut className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}