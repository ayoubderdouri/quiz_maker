import Link from "next/link";

export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="font-semibold text-lg">Maker</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/auth/login"
              className="px-3 py-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Inscription
            </Link>
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
