"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authHelpers } from "@/lib/authHelpers";
import { ArrowRight, Zap, Users, BarChart3 } from "lucide-react";

export default function Home() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Si l'utilisateur est authentifié, le rediriger vers les quiz
		const token = authHelpers.getToken();
		if (token) {
			router.push("/dashboard");
		} else {
			setIsLoading(false);
		}
	}, [router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-blue-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-zinc-900">
			{/* Navigation */}
			<nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-zinc-200">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="font-bold text-xl text-white">Q</span>
					</div>
					<span className="font-bold text-xl text-zinc-900">Maker</span>
				</div>

				<div className="flex items-center gap-4">
					<Link
						href="/auth/login"
						className="px-6 py-2.5 text-zinc-700 hover:text-blue-600 transition"
					>
						Connexion
					</Link>
					<Link
						href="/auth/register"
						className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
					>
						S'inscrire
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
				<div className="max-w-2xl">
					<h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
						Créez des Quiz Intelligents
					</h1>
					<p className="text-xl text-zinc-600 mb-8">
						Générez des quiz professionnels instantanément avec l'IA. Partagez-les, collectez des réponses et analysez les résultats en temps réel.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
						<Link
							href="/auth/register"
							className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition w-full sm:w-auto justify-center"
						>
							Commencer Gratuitement
							<ArrowRight className="w-5 h-5" />
						</Link>
						<Link
							href="/auth/login"
							className="px-8 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-900 rounded-lg font-semibold transition"
						>
							J'ai déjà un compte
						</Link>
					</div>

					{/* Features */}
					<div className="grid md:grid-cols-3 gap-8 mt-16">
						<div className="p-6 rounded-lg bg-white border border-zinc-200 hover:border-blue-300 shadow-sm hover:shadow-md transition">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
								<Zap className="w-6 h-6 text-blue-600" />
							</div>
							<h3 className="font-semibold text-lg mb-2 text-zinc-900">Génération IA</h3>
							<p className="text-zinc-600">
								Créez des quiz professionnels en secondes avec l'intelligence artificielle
							</p>
						</div>

						<div className="p-6 rounded-lg bg-white border border-zinc-200 hover:border-blue-300 shadow-sm hover:shadow-md transition">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
								<Users className="w-6 h-6 text-blue-600" />
							</div>
							<h3 className="font-semibold text-lg mb-2 text-zinc-900">Partage Facile</h3>
							<p className="text-zinc-600">
								Partagez vos quiz avec des liens uniques sans nécessiter d'authentification
							</p>
						</div>

						<div className="p-6 rounded-lg bg-white border border-zinc-200 hover:border-blue-300 shadow-sm hover:shadow-md transition">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
								<BarChart3 className="w-6 h-6 text-blue-600" />
							</div>
							<h3 className="font-semibold text-lg mb-2 text-zinc-900">Analyse</h3>
							<p className="text-zinc-600">
								Consultez les résultats et les statistiques de vos quiz en temps réel
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-zinc-200 py-6 px-6 text-center text-zinc-500 text-sm bg-zinc-50">
				<p>&copy; 2026 Quiz Maker. Tous droits réservés.</p>
			</footer>
		</div>
	);
}

