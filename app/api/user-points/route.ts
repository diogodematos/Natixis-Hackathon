import { NextResponse } from "next/server";
import { createServerAdminClient } from "@/utils/supabase/createServerAdminClient";

export async function GET(req: Request) {
  const supabase = await createServerAdminClient();

  try {
    // Obter ID do usuário autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Consultar os dados de pontos e CO2 do usuário
    const { data: profile, error: profileError } = await supabase
      .from("user_profile")
      .select("points, total_co2_saved")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { message: "Erro ao buscar perfil do usuário" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      points: profile.points,
      total_co2_saved: profile.total_co2_saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
