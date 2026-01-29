import { Settings, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-end">

        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
