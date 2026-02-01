"use client";

import { X, Moon, Sun, Palette } from "lucide-react";
import { useState, useEffect } from "react";

const themes = [
	{ name: "Zinc", colors: "bg-zinc-600 dark:bg-zinc-700" },
	{ name: "Blue", colors: "bg-blue-600 dark:bg-blue-700" },
	{ name: "Purple", colors: "bg-purple-600 dark:bg-purple-700" },
	{ name: "Red", colors: "bg-red-600 dark:bg-red-700" },
	{ name: "Green", colors: "bg-green-600 dark:bg-green-700" },
	{ name: "Amber", colors: "bg-amber-600 dark:bg-amber-700" },
];

export function ThemeSettingsDialog({ open, onClose }) {
	const [darkMode, setDarkMode] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState("Blue");

	useEffect(() => {
		// Charger les préférences
		const savedTheme = localStorage.getItem("theme") || "Blue";
		const savedDarkMode = localStorage.getItem("darkMode") === "true";
		setSelectedTheme(savedTheme);
		setDarkMode(savedDarkMode);
	}, [open]);

	const handleThemeChange = (theme) => {
		setSelectedTheme(theme);
		localStorage.setItem("theme", theme);
		// TODO: Appliquer le thème
	};

	const handleDarkModeChange = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem("darkMode", newDarkMode);

		// Appliquer au DOM
		if (newDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	if (!open) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/40 z-40"
				onClick={onClose}
			/>

			{/* Dialog */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-md w-full">
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
						<h2 className="text-lg font-semibold">Paramètres du thème</h2>
						<button
							onClick={onClose}
							className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Content */}
					<div className="p-6 space-y-6">
						{/* Dark Mode */}
						<div>
							<div className="flex items-center justify-between mb-3">
								<label className="text-sm font-medium">Mode sombre</label>
								<button
									onClick={handleDarkModeChange}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
										darkMode
											? "bg-blue-600"
											: "bg-zinc-300 dark:bg-zinc-600"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											darkMode ? "translate-x-6" : "translate-x-1"
										}`}
									/>
								</button>
							</div>
							<p className="text-xs text-zinc-500">
								{darkMode ? "Mode sombre activé" : "Mode clair activé"}
							</p>
						</div>

						{/* Theme Colors */}
						<div>
							<label className="text-sm font-medium block mb-3">
								Couleur d'accentuation
							</label>
							<div className="grid grid-cols-3 gap-3">
								{themes.map((theme) => (
									<button
										key={theme.name}
										onClick={() => handleThemeChange(theme.name)}
										className={`p-3 rounded-lg border-2 transition-all ${
											selectedTheme === theme.name
												? "border-blue-600 dark:border-blue-400"
												: "border-zinc-200 dark:border-zinc-700"
										}`}
									>
										<div className={`h-8 rounded ${theme.colors} mb-2`} />
										<p className="text-xs font-medium text-center">
											{theme.name}
										</p>
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
						<button
							onClick={onClose}
							className="flex-1 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
						>
							Fermer
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
