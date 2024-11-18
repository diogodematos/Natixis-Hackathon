import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Busca os itens da tabela 'articles' que nao foram doados
  const { data: items, error } = await supabase.from("articles").select("*").eq("status", "available");

  const imgUrl = "https://kcnpyqaspsufryjtjshi.supabase.co/storage/v1/object/public/images/";

  if (error) {
    return NextResponse.json(
      { message: "Erro ao buscar os itens", error: error.message },
      { status: 500 }
    );
  }

  items.forEach((item) => {
    const img = imgUrl + item.id + ".jpg";
    item.image = img;
  });

  return NextResponse.json({ data: items }, { status: 200 });
}
