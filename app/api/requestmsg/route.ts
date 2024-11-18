import { createClient } from "@/utils/supabase/server"; // Certifique-se de que o cliente está configurado corretamente
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  // Busca os itens da tabela 'requests'
  const { data: items, error } = await supabase.from("request").select("*");

  if (error) {
    return NextResponse.json(
      { message: "Erro ao buscar os itens", error: error.message },
      { status: 500 }
    );
  }
  console.log(items);
  return NextResponse.json({ data: items }, { status: 200 });
}
