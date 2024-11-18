import { NextResponse } from "next/server";
import { createServerAdminClient } from "@/utils/supabase/createServerAdminClient";

export async function GET() {
  const supabase = await createServerAdminClient();

  try {
    // Consulta para o ranking de CO2
    const { data: co2LeaderboardRaw, error: co2Error } = await supabase
      .from("user_profile")
      .select("name, total_co2_saved")
      .order("total_co2_saved", { ascending: false });

    if (co2Error) {
      console.error(`Erro ao buscar ranking de CO2: ${co2Error.message}`);
      throw new Error(`Erro ao buscar ranking de CO2: ${co2Error.message}`);
    }

    // Formata os dados do ranking de CO2
    const co2Leaderboard = co2LeaderboardRaw.map((entry) => ({
      name: entry.name,
      value: entry.total_co2_saved,
    }));

    // Consulta para o ranking de pontos
    const { data: pointsLeaderboardRaw, error: pointsError } = await supabase
      .from("user_profile")
      .select("name, points")
      .order("points", { ascending: false });

    if (pointsError) {
      console.error(`Erro ao buscar ranking de pontos: ${pointsError.message}`);
      throw new Error(`Erro ao buscar ranking de pontos: ${pointsError.message}`);
    }

    // Formata os dados do ranking de pontos
    const pointsLeaderboard = pointsLeaderboardRaw.map((entry) => ({
      name: entry.name,
      value: entry.points,
    }));

    // Retorna os dois rankings
    return NextResponse.json({
      co2Leaderboard,
      pointsLeaderboard,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erro ao buscar rankings" },
      { status: 500 }
    );
  }
}
