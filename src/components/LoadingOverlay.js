"use client";

export function LoadingOverlay() {
	return (
		<div className="fixed inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="flex flex-col items-center gap-3">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<p className="text-sm text-zinc-600 dark:text-zinc-400">Chargement...</p>
			</div>
		</div>
	);
}
