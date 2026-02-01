import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
	try {
		const { email, password } = await request.json();

		// Validation
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email et mot de passe sont requis" },
				{ status: 400 }
			);
		}

		// Chercher l'utilisateur
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Email ou mot de passe incorrect" },
				{ status: 401 }
			);
		}

		// Vérifier le mot de passe
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "Email ou mot de passe incorrect" },
				{ status: 401 }
			);
		}

		// Créer un JWT
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return NextResponse.json(
			{
				message: "Connexion réussie",
				token,
				user: { id: user.id, email: user.email, name: user.name },
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erreur lors de la connexion:", error);
		return NextResponse.json(
			{ error: "Une erreur s'est produite lors de la connexion" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
