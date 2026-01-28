import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata = {
  title: "Quiz Maker",
  description: "Create and manage quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
            <main className="pt-16 h-full bg-zinc-50 dark:bg-zinc-900 ">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
