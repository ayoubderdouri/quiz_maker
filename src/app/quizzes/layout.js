import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export const metadata = {
  title: "Quiz Maker",
  description: "Create and manage quizzes",
};

export default function QuizLayout({ children }) {
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  );
}