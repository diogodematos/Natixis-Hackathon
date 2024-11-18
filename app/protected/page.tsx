"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import Lottie from 'lottie-react';
import animationData from '../../public/animations/ballons.json';  // Substitua pelo caminho do seu arquivo JSON da animação Lottie
import Loading from "@/components/Loading";

interface LeaderboardEntry {
  name: string;
  value: number;
}

export default function ProtectedPage() {
  const [co2Leaderboard, setCo2Leaderboard] = useState<LeaderboardEntry[]>([]);
  const [pointsLeaderboard, setPointsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCo2Saved, setTotalCo2Saved] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Erro ao buscar rankings");
        }

        const data = await response.json();
        console.log(data);
        setCo2Leaderboard(data.co2Leaderboard);
        setPointsLeaderboard(data.pointsLeaderboard);
        // Soma o CO2 de todos os usuários
        const total = data.co2Leaderboard.reduce((acc: number, entry: LeaderboardEntry) => acc + entry.value, 0);
        setTotalCo2Saved(total);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar rankings");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  if (loading) {
    return  <Loading />;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col px-50 py-10">
      <header className="text-center mb-20">
        <h1 className="text-3xl text-white font-semibold mb-4">
          TOGETHER WE SAVED <span className="text-5xl font-bold text-green-500">{totalCo2Saved}KG</span> OF CO2
        </h1>
      </header>

	  <section className="body mb-[56px]">
  <div className="flex justify-center gap-20 mb-[51px] mt-5">
    <div className="relative group">
      <Link href="/shelf">
        <button
          className="px-16 min-w-[260px] max-w-[300px] text-xl py-7 bg-[#59247A] font-semibold rounded-[32px] text-white shadow-md transition-all duration-300 hover:bg-[#9C5AC6] focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          SHELF-OUT
        </button>
      </Link>
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#113948] text-white text-sm px-3 py-2 rounded-[50px] shadow-lg">
        GRAB FROM THE SHELF
      </div>
    </div>

    <div className="relative group">
      <Link href="/donate">
        <button
          className="px-16 min-w-[260px] max-w-[300px] text-xl py-7 bg-[#59247A] font-semibold rounded-[32px] text-white shadow-md transition-all duration-300 hover:bg-[#9C5AC6] focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          SHELF-IN
        </button>
      </Link>
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#113948] text-white text-sm px-3 py-2 rounded-[50px] shadow-lg">
        PUT ON THE SHELF
      </div>
    </div>
  </div>
</section>



	  <section className="flex flex-col mt-20 items-center justify-center mb-6">
  <p className="text-2xl font-thin mb-2 text-[#DBAEED] pl-2"> LEADERBOARDS</p>

  <div className="mx-auto mb-10 cursor-pointer" style={{ width: "50px", height: "50px" }}>
    <svg width="59" height="35" viewBox="0 0 59 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M57.8325 6.93548L31.6794 34.1129C31.3681 34.4355 31.0308 34.6634 30.6675 34.7968C30.3043 34.9323 29.9151 35 29.5 35C29.0849 35 28.6957 34.9323 28.3325 34.7968C27.9692 34.6634 27.6319 34.4355 27.3206 34.1129L1.08971 6.93548C0.363236 6.18279 0 5.24193 0 4.1129C0 2.98387 0.389182 2.01613 1.16755 1.20968C1.94591 0.403225 2.854 -9.9136e-07 3.89182 -9.9136e-07C4.92964 -9.9136e-07 5.83773 0.403225 6.61609 1.20968L29.5 24.9194L52.3839 1.20968C53.1104 0.456988 54.005 0.0806429 55.0677 0.0806429C56.1325 0.0806429 57.0541 0.483869 57.8325 1.29032C58.6108 2.09677 59 3.03763 59 4.1129C59 5.18817 58.6108 6.12903 57.8325 6.93548Z" fill="#DBAEED"/>
</svg>

  </div>
</section>

	  <section className="flex justify-center gap-10">
  {/* Ranking de CO2 */}
  <div className="w-1/2">
    <h2 className="text-center text-2xl text-green-500 font-semibold mb-3">CO2 RANKING</h2>
    <table className="table-auto w-full text-left bg-white opacity-50 rounded-[24px]">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2">USER</th>
          <th className="px-4 py-2">CO2 SAVED (KG)</th>
        </tr>
      </thead>
      <tbody>
        {co2Leaderboard.map((user, index) => (
          <tr
            key={index}
            className={`${
              index === co2Leaderboard.length - 1 ? "" : "border-b"
            }`}
          >
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Ranking de Pontos */}
  <div className="w-1/2">
    <h2 className="text-center text-2xl text-[#165770] font-semibold mb-3">POINTS RANKING</h2>
    <table className="table-auto w-full text-left bg-white opacity-50 rounded-[24px]">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2">USER</th>
          <th className="px-4 py-2">POINTS</th>
        </tr>
      </thead>
      <tbody>
        {pointsLeaderboard.map((user, index) => (
          <tr
            key={index}
            className={`${
              index === pointsLeaderboard.length - 1 ? "" : "border-b"
            }`}
          >
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>


      <Link href="/requests">
        <button
          className="fixed bottom-6 right-6 bg-[#41A6C2] text-[#005871] font-semibold px-7 py-3 rounded-full shadow-lg hover:bg-[#50C1E0] transition-all z-15"
          style={{ zIndex: 10 }}
        >
          CHECK OUT THE <br />
          COMMUNITY WISHES
        </button>
      </Link>
	  <Lottie
          animationData={animationData}
          loop={true}
		  className="fixed bottom-[95px] right-[-35px] w-[380px] h-[480px] z-10"
        />


    </div>
  );
}
