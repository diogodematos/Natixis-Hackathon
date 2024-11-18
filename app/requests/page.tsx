"use client";

import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requestmsg");
        if (!response.ok) {
          throw new Error("Erro ao buscar os pedidos");
        }
        const { data } = await response.json();
        setRequests(data || []);
      } catch (err) {
        console.error("Erro ao buscar os pedidos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleSendEmail = () => {
    if (!selectedRequest) return;

    const email = selectedRequest.user_mail;
    const subject = "Contato sobre o pedido";
    const body = `Hello! I have want you are looking for, the "${selectedRequest.Message}".`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl text-white font-bold mb-10 text-center">THE WISHES</h1>
	  <h1 className="text-1xl text-white font-medium mb-10 text-center">Click on the speech bubble to contact the person directly if you have their wish. </h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
          {requests.length > 0 ? (
            requests.map((request, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={request.id}
                  onClick={() => handleRequestClick(request)}
                  className="relative max-w-md w-full bg-white shadow-lg rounded-[70px] p-4 text-gray-800 cursor-pointer"
                >
                  <p className="text-lg">{request.Message}</p>
                  <div
                    className={`absolute bottom-[-7px] ${isLeft ? "left-8" : "right-8"} w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white`}
                  ></div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">There's no wishes.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-[32px] shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Do you want to contact this person?</h2>
            <p className="mb-4">If you have the {selectedRequest?.Message}.</p>
            <div className="flex justify-around">
			<button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-[60px] hover:bg-gray-600"
              >
                No
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-[#59247A]  text-white px-4 py-2 rounded-[60px] hover:bg-[#9C5AC6]"
              >
                Yes, I have it
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
