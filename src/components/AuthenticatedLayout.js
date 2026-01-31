import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-16 h-full bg-zinc-50 dark:bg-zinc-900 ">
          {children}
        </main>
      </div>
    </div>
  );
}
