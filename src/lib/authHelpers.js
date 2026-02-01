// Utilitaires pour gérer l'authentification côté client

export const authHelpers = {
	// Sauvegarder le token (dans localStorage ET dans les cookies)
	setToken: (token) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("authToken", token);
			// Sauvegarder aussi dans les cookies avec expiration 7 jours
			const expirationDate = new Date();
			expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
			document.cookie = `authToken=${token}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
		}
	},

	// Récupérer le token
	getToken: () => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("authToken");
		}
		return null;
	},

	// Supprimer le token (logout)
	removeToken: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("authToken");
			localStorage.removeItem("user");
			// Supprimer aussi du cookie
			document.cookie =
				"authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;";
		}
	},

	// Sauvegarder les données utilisateur
	setUser: (user) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("user", JSON.stringify(user));
		}
	},

	// Récupérer les données utilisateur
	getUser: () => {
		if (typeof window !== "undefined") {
			const user = localStorage.getItem("user");
			return user ? JSON.parse(user) : null;
		}
		return null;
	},

	// Vérifier si l'utilisateur est authentifié
	isAuthenticated: () => {
		return !!authHelpers.getToken();
	},

	// Récupérer le token depuis les cookies (utile côté serveur)
	getTokenFromCookie: (cookieString) => {
		if (!cookieString) return null;
		const cookies = cookieString.split(";").reduce((acc, cookie) => {
			const [key, value] = cookie.trim().split("=");
			acc[key] = value;
			return acc;
		}, {});
		return cookies.authToken || null;
	},
};
