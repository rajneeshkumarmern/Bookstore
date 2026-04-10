export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-3xl bg-white/[0.03] p-8 text-center text-white/80">
      <div className="inline-flex items-center gap-3">
        <svg
          className="h-8 w-8 animate-spin text-amber-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2" />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm font-medium text-white/80">{label}</span>
      </div>
    </div>
  )
}
