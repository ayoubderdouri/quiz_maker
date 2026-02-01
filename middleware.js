import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function middleware(request) {
	const path = request.nextUrl.pathname;

	// Routes publiques (sans authentification requise)
	const publicRoutes = ["/auth/login", "/auth/register", "/", "/share"];

	// Vérifier si la route commence par une route publique
	const isPublicRoute = publicRoutes.some((route) => {
		if (route === "/") return path === "/";
		if (route === "/share") return path.startsWith("/share/");
		return path.startsWith(route);
	});

	if (isPublicRoute) {
		return NextResponse.next();
	}

	// Pour les routes protégées, vérifier le token
	// D'abord vérifier dans les headers (Authorization Bearer)
	let token = request.headers.get("authorization")?.replace("Bearer ", "");

	// Si pas de token dans Authorization, vérifier dans les cookies
	if (!token) {
		token = request.cookies.get("authToken")?.value;
	}

	if (!token) {
		// Rediriger vers la connexion si pas de token
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	try {
		// Vérifier que le token est valide
		await jwtVerify(token, SECRET);
		return NextResponse.next();
	} catch (error) {
		// Token invalide ou expiré, rediriger vers la connexion
		const response = NextResponse.redirect(new URL("/auth/login", request.url));
		response.cookies.delete("authToken");
		return response;
	}
}

export const config = {
	matcher: [
		"/quizzes/:path*",
		"/results/:path*",
		"/api/quizzes/:path*",
		"/api/generate-quiz/:path*",
		"/api/responses/:path*",
	],
};
