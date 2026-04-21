export default function Skeleton() {
  return (
    <article className="glass-panel group overflow-hidden rounded-3xl bg-white/5 text-white/80 transition-all duration-200">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] bg-white/5">
        <div className="h-full w-full bg-white/10 animate-pulse" />
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="h-4 w-5/6 rounded-full bg-white/10 animate-pulse" />
          <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="h-6 w-24 rounded-full bg-white/10 animate-pulse" />
          <div className="h-11 w-28 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </article>
  )
}
