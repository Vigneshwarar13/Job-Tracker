import { Calendar, AlertCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import { isDatePast } from '../lib/dateUtils'

export default function DateInput({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  icon: Icon = Calendar,
  className,
  required = false
}) {
  const isPast = isDatePast(value)

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        <Icon className={cn(
          "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
          error ? "text-red-400" : "text-slate-400 group-focus-within:text-primary-500"
        )} />
        <input
          type="date"
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={cn(
            "w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0",
            error 
              ? "border-red-200 focus:ring-red-500/20 focus:border-red-500" 
              : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500",
            isPast && !error && "text-amber-600 font-medium"
          )}
        />
        {isPast && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 group-hover:block hidden">
            <div className="bg-amber-50 text-amber-600 text-[10px] px-1.5 py-0.5 rounded border border-amber-100 font-bold uppercase tracking-tight">
              Past Date
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  )
}
