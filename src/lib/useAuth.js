"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelpers } from "@/lib/authHelpers";

export function useAuth() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const verifyAuth = async () => {
			const token = authHelpers.getToken();
			const authenticatedUser = authHelpers.getUser();

			if (!token || !authenticatedUser) {
				setIsAuthenticated(false);
				setIsLoading(false);
				return;
			}

			try {
				// Vérifier le token avec le serveur
				const response = await fetch("/api/auth/verify", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					setUser(authenticatedUser);
					setIsAuthenticated(true);
				} else {
					// Token invalide, nettoyer
					authHelpers.removeToken();
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Auth verification failed:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		verifyAuth();
	}, []);

	const logout = () => {
		authHelpers.removeToken();
		setUser(null);
		setIsAuthenticated(false);
		router.push("/auth/login");
	};

	return {
		user,
		isLoading,
		isAuthenticated,
		logout,
	};
}
