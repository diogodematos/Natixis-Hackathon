"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirecionamento
import Loading from "@/components/Loading";
import { createClient } from "@/utils/supabase/client";

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  donation_type: string;
  image: string | null;
  status: string;
  user_email: string;
}

interface ShelfPageProps {
  userEmail: string;
}

export default function ShelfPage({ userEmail }: ShelfPageProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleRequest = async () => {
	try {
	  // Alterar aqui: passando a chave como 'Message'
	  const response = await fetch("/api/requestInsert", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		// Passando a chave 'Message' ao invés de 'message'
		body: JSON.stringify({ Message: message }),  // Alteração aqui
	  });

	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Failed to send request");
	  }

	  const data = await response.json();
	  setResponseMessage(data.message); // Mensagem de sucesso
	  setMessage(""); // Limpa o campo de mensagem
	} catch (err: any) {
	  setResponseMessage(err.message || "Error sending request");
	}
  };

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();

      // Verifica a sessão do usuário
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/sign-in");
      }
    };

    const fetchItems = async () => {
      try {
        const response = await fetch("/api/getItems");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data.data);
      } catch (err: any) {
        setError(err.message || "Error fetching items");
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Verifica autenticação
    fetchItems(); // Busca os itens
  }, [router]);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleReservation = () => {
    if (selectedItem && selectedItem.user_email) {
      const email = selectedItem.user_email;
      const mailtoLink = `mailto:${email}?subject=Pedido de Mensagem&body=Hello, I'm interested in using ${selectedItem.title}.`;
      window.location.href = mailtoLink;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  const filteredItems = items.filter(item =>
	item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
	item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-white font-bold mb-10 text-center">COMMUNITY SHELF</h1>
<div className="mb-6">
  <input
    type="text"
    placeholder="Search for items..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full p-2 rounded-[70px] pl-4"
  />
</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       {filteredItems.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-[23px] overflow-hidden">
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover" onError={(e) => e.target.src = "images/articles.png"} />
            )}
            <div className="p-4">
              <h2 className="text-xl text-gray-700 font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-700 mt-2">Category: {item.category}</p>
              <p className="text-sm text-gray-700 mt-1">Donation Type: {item.donation_type}</p>
              <div className="mt-4">
                <button
                  onClick={() => openModal(item)}
                  className="w-full bg-[#287A90] rounded-[70px] text-white py-2 px-4 hover:bg-[#3EA3BF] focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="text-center text-lg">No items available in the shelf.</p>}

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl text-gray-700 font-semibold">{selectedItem.title}</h2>
            <p className="text-sm text-gray-500 mt-2">{selectedItem.description}</p>
            <p className="text-sm text-gray-700 mt-2">Category: {selectedItem.category}</p>
            <p className="text-sm text-gray-700 mt-1">Donation Type: {selectedItem.donation_type}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={closeModal}
                className="px-10 py-3 bg-[#A4A4A4] rounded-[70px] text-white shadow-md transition-all duration-300 hover:bg-[#C9C9C9] focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Close
              </button>
              <button
                onClick={handleReservation}
                className="px-10 py-3 bg-[#59247A] rounded-[70px] text-white shadow-md transition-all duration-300 hover:bg-[#9C5AC6] focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
<div className="mt-20 text-center">
<p className="text-lg text-white font-normal mb-4">
  Didn't find what you are looking for?
  <br />
  <span className="font-bold">We got you covered!</span>
</p>
  <div className="relative mx-auto max-w-md mb-6">
    {/* Balão de fala */}
    <div className="bg-white p-4 rounded-[20px] shadow-lg border border-gray-300">
      <textarea
        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        rows={1}
        placeholder="Write here the item..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
    </div>
    {/* Ponteiro do balão */}
    <div className="absolute bottom-[-10px] left-[50%] translate-x-[-50%] w-6 h-6 bg-white rotate-45"></div>
  </div>
  {/* Botão abaixo do balão */}
  <button
    onClick={handleRequest}
    className="px-10 py-5 mt-4 bg-[#59247A] font-semibold rounded-[32px] text-white shadow-md transition-all duration-300 hover:bg-[#9C5AC6] focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    ASK THE COMMUNITY
  </button>
  {responseMessage && (
    <p className="mt-4 text-sm text-white">
      {responseMessage}
    </p>
  )}
</div>


    </div>
  );
}
