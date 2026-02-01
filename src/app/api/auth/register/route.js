import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
	try {
		const { email, name, password } = await request.json();

		// Validation
		if (!email || !name || !password) {
			return NextResponse.json(
				{ error: "Email, nom et mot de passe sont requis" },
				{ status: 400 }
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Le mot de passe doit contenir au moins 6 caractères" },
				{ status: 400 }
			);
		}

		// Vérifier si l'utilisateur existe
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Cet email est déjà utilisé" },
				{ status: 409 }
			);
		}

		// Hacher le mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		// Créer l'utilisateur
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		});

		// Créer un JWT
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return NextResponse.json(
			{
				message: "Inscription réussie",
				token,
				user: { id: user.id, email: user.email, name: user.name },
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Erreur lors de l'inscription:", error);
		return NextResponse.json(
			{ error: "Une erreur s'est produite lors de l'inscription" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
