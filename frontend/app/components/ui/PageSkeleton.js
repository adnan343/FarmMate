export default function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-white/[0.06] rounded-lg w-48"></div>
        <div className="h-4 bg-white/[0.04] rounded-lg w-72"></div>
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.04] rounded-2xl p-6 space-y-3">
            <div className="h-4 bg-white/[0.06] rounded w-24"></div>
            <div className="h-6 bg-white/[0.08] rounded w-16"></div>
          </div>
        ))}
      </div>
      {/* Content skeleton */}
      <div className="bg-white/[0.04] rounded-2xl p-6">
        <div className="h-6 bg-white/[0.06] rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.04] rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
