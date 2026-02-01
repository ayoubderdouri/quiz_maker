import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function GET(request) {
	try {
		// Récupérer le token du header Authorization
		const authHeader = request.headers.get("Authorization");
		if (!authHeader?.startsWith("Bearer ")) {
			return NextResponse.json(
				{ authenticated: false, error: "No token provided" },
				{ status: 401 }
			);
		}

		const token = authHeader.substring(7);

		// Vérifier le token
		const verified = await jwtVerify(token, SECRET);

		return NextResponse.json({
			authenticated: true,
			user: verified.payload,
		});
	} catch (error) {
		return NextResponse.json(
			{ authenticated: false, error: "Invalid token" },
			{ status: 401 }
		);
	}
}
