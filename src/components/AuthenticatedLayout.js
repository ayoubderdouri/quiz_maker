'use client';

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ThemeSettingsDialog } from "@/components/ThemeSettingsDialog";

export default function AuthenticatedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={() => setShowThemeDialog(true)}
      />

      <div className="flex-1 md:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="pt-16 h-full bg-zinc-50 dark:bg-zinc-900">
          {children}
        </main>
      </div>

      <ThemeSettingsDialog
        open={showThemeDialog}
        onClose={() => setShowThemeDialog(false)}
      />
    </div>
  );
}
