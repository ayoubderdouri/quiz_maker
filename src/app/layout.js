import "./globals.css";

export const metadata = {
  title: "Quiz Maker",
  description: "Create and manage quizzes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
