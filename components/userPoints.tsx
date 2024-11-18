"use client";

import { useEffect, useState } from "react";

export default function UserPoints() {
  const [points, setPoints] = useState<number>(0);
  const [totalCo2Saved, setTotalCo2Saved] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await fetch("/api/user-points");
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Erro ao buscar dados do usuário");
        }

        const data = await response.json();
        setPoints(data.points || 0);
        setTotalCo2Saved(data.total_co2_saved || 0);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, []);

  if (loading) {
    return ;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="text-[#0F2E3A] text-1xl font-medium">
      <br />
      Points:{" "}
      <span className="text-[#102E3B] font-bold">{points}</span> <br />
      Saved CO2:{" "}
      <span className="text-[#102E3B] font-bold">{totalCo2Saved}KG</span>
    </div>
  );
}
