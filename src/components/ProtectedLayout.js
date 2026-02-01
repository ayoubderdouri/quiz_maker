"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedLayout({ children }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/auth/login");
		}
	}, [isAuthenticated, isLoading, router]);

	// Si pas authentifié et pas en chargement, retourner null
	if (!isLoading && !isAuthenticated) {
		return null;
	}

	// Même pendant le chargement, afficher les enfants (le layout reste visible)
	// Mais si pas authentifié après vérification, on a déjà retourné null
	return <>{children}</>;
}
