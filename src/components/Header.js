"use client";

import { User, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authHelpers } from "@/lib/authHelpers";

export default function Header({ onToggleSidebar }) {
	const router = useRouter();
	const [currentUser, setCurrentUser] = useState(null);
	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		const user = authHelpers.getUser();
		setCurrentUser(user);
	}, []);

	const handleLogout = () => {
		authHelpers.removeToken();
		router.push("/auth/login");
	};

	return (
		<header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 fixed top-0 right-0 left-0 md:left-64 z-10">
			<div className="h-full px-6 flex items-center justify-between md:justify-end">
				<button
					onClick={onToggleSidebar}
					className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
				>
					<Menu className="w-5 h-5" />
				</button>
				<div className="flex items-center gap-4">
					<div className="relative">
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
							title={currentUser?.name || "Utilisateur"}
						>
							<User className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
						</button>

						{showMenu && (
							<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg">
								<div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
									<p className="text-sm font-medium">
										{currentUser?.name}
									</p>
									<p className="text-xs text-zinc-500">
										{currentUser?.email}
									</p>
								</div>
								<button
									onClick={handleLogout}
									className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-2"
								>
									<LogOut className="w-4 h-4" />
									Déconnexion
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
