import { cn } from "../lib/utils"

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
  )
}

export function TableSkeleton() {
  return (
    <div className='bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm'>
      <div className='px-6 py-4 bg-slate-50/50 border-b border-slate-200'>
        <div className='flex gap-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-4 w-24' />
          ))}
        </div>
      </div>
      <div className='divide-y divide-slate-100'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='px-6 py-5 flex items-center justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-4 w-24' />
            </div>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-6 w-24 rounded-full' />
            <Skeleton className='h-8 w-8 rounded-xl' />
          </div>
        ))}
      </div>
    </div>
  )
}
