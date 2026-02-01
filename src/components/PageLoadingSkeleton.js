"use client";

export function PageLoadingSkeleton() {
	return (
		<div className="space-y-6 p-6 animate-pulse">
			{/* Header skeleton */}
			<div className="space-y-2">
				<div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
				<div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
			</div>

			{/* Content skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="bg-white dark:bg-zinc-800 rounded-lg p-6 space-y-4">
						<div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
						<div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
						<div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
					</div>
				))}
			</div>
		</div>
	);
}
