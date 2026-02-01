"use client";

import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { ProtectedLayout } from "@/components/ProtectedLayout";

export default function QuizLayout({ children }) {
  return (
    <ProtectedLayout>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </ProtectedLayout>
  );
}