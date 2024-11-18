"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirecionar o usuário após logout
import { signOutAction, deleteItemAction, deliverItemAction } from "@/app/actions"; // Certifique-se de que o caminho está correto
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";

type Article = {
	id: string;
	title: string;
	description: string;
	category: string;
	donation_type: string;
	image: string | null;
	status: "available" | "unavailable";
	created_at: string;
	user_id: string;
};

export default function PersonalPage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter(); // Para manipular redirecionamento após logout

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await fetch("/api/user-articles", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					const { message } = await response.json();
					setError(message || "Error fetching articles");
					setLoading(false);
					return;
				}

				const { articles } = await response.json();
				setArticles(articles);
			} catch (err) {
				setError("Error fetching articles");
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
	}, []);

	const handleLogout = async () => {
		try {
			await signOutAction(); // Executa o logout
			router.push("/sign-in"); // Redireciona para a página de login
		} catch (err) {
			console.error("Erro ao deslogar:", err);
		}
	};

	const handleDelete = async (id: string) => {
		// Exibe o diálogo de confirmação
		const confirmed = window.confirm("Are you sure you want to delete this article?");
		if (confirmed) {
			// Se o usuário confirmar, executa a ação de deletar
			try {
				await deleteItemAction(id);
				// Atualiza a lista de artigos removendo o deletado
				setArticles((prev) => prev.filter((article) => article.id !== id));
			} catch (err) {
				console.error("Erro ao deletar o artigo:", err);
			}
		}
	};

	if (loading) {
		return (
			<Loading />);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<div className="text-center text-white">PLEASE LOGIN</div>
				<button
					onClick={() => router.push("/sign-in")}
					className="px-4 py-2 bg-[#59247A] rounded-[30px] text-white hover:bg-blue-600 mt-4"
				>
					LOGIN
				</button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			   <div className="container mx-auto px-4 py-8">
			   <h1 className="text-3xl text-white font-bold mb-4 text-center">MY SPACE</h1>

			</div>
			<h1 className="text-2xl font-bold items-center mb-2 text-white">I'm giving...</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

				{articles.map((article) => (
					<div
						key={article.id}
						className="bg-white rounded-[23px]  shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
					>
						{article.image && (
							<img
								src={article.image}
								alt={article.title}
								className="w-full h-40 object-cover"
							/>
						)}
						<div className="p-4">
							<h2 className="text-xl font-bold text-gray-800">{article.title}</h2>
							<p className="text-sm text-gray-600 mt-2">Category: {article.category}</p>
							<p className="text-sm text-gray-600">Donation Type: {article.donation_type}</p>
							<p
								className={`mt-3 text-sm font-semibold ${
									article.status ? "text-green-500" : "text-red-500"
								}`}
							>
								{article.status}
							</p>
							<div className="mt-4 space-y-2">
								<Button
									variant="default"
									onClick={() => handleDelete(article.id)}
									className="w-full bg-[#C6C6C6] text-[#626262] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#DEDEDE]"
								>
									DELETE
								</Button>
								{article.status === "available" && (
									<Button
										variant="default"
										onClick={() => {deliverItemAction(article.id, article.category, article.user_id);
											window.location.reload();
										}}
										className="w-full bg-[#41A6C2] text-[#005871] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#50C1E0]"
									>
										DELIVER ITEM
									</Button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-end mt-20">
  <button
    onClick={handleLogout}
    className="px-6 py-2 bg-[#59247A] font-medium rounded-[32px] text-white text-white shadow-md transition-all duration-300 hover:bg-[#9C5AC6] focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    LOGOUT
  </button>
</div>

		</div>
	);
}
