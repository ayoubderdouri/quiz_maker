import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function verifyAuth(request) {
	try {
		// Récupérer le token du header Authorization
		const authHeader = request.headers.get("Authorization");
		
		if (!authHeader?.startsWith("Bearer ")) {
			return {
				authenticated: false,
				error: "No authorization token provided",
			};
		}

		const token = authHeader.substring(7);

		// Vérifier le token
		const verified = await jwtVerify(token, SECRET);

		return {
			authenticated: true,
			user: verified.payload,
		};
	} catch (error) {
		return {
			authenticated: false,
			error: "Invalid or expired token",
		};
	}
}

export function createUnauthorizedResponse(error = "Unauthorized") {
	return NextResponse.json(
		{ error },
		{ status: 401 }
	);
}
