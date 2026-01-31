import Link from "next/link";

export default function RegisterPage() {
	return (
		<div className="w-full max-w-md">
			<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-8">
				<div className="mb-6">
					<h1 className="text-2xl font-bold">Inscription</h1>
					<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
						Créez votre compte en quelques secondes
					</p>
				</div>

				<form className="space-y-4">
					<div className="space-y-1">
						<label className="text-sm font-medium">Nom complet</label>
						<input
							type="text"
							name="name"
							placeholder="Votre nom"
							className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="space-y-1">
						<label className="text-sm font-medium">Email</label>
						<input
							type="email"
							name="email"
							placeholder="vous@exemple.com"
							className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="space-y-1">
						<label className="text-sm font-medium">Mot de passe</label>
						<input
							type="password"
							name="password"
							placeholder="••••••••"
							className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full mt-2 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
					>
						Créer mon compte
					</button>
				</form>

				<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-6 text-center">
					Déjà inscrit ?{" "}
					<Link href="/auth/login" className="text-blue-600 hover:underline">
						Se connecter
					</Link>
				</p>
			</div>
		</div>
	);
}
