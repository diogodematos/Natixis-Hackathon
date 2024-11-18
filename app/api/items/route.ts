import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json(); // Lê o corpo da requisição

  const { title, description, category, donation_type, image, status } = body;

  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!title || !category || !donation_type) {
    return NextResponse.json(
      { message: "Campos obrigatórios não preenchidos" },
      { status: 400 }
    );
  }

  // Busca o ID do usuário logado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json(
      { message: "Erro ao obter usuário", error: authError.message },
      { status: 401 }
    );
  }

  const user_id = user?.id;
  const user_email = user?.email; // Adicionando o e-mail do usuário

  // Insere o item no banco de dados, incluindo o e-mail do usuário
  const { data, error } = await supabase.from("articles").insert([
    {
      title,
      description,
      category,
      donation_type,
      image,
      user_id,
      user_email, // Armazenando o e-mail do usuário
      status: status ?? true, // Valor padrão: `true`
    },
  ]);

  if (error) {
    return NextResponse.json(
      { message: "Erro ao salvar item", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Item criado com sucesso!", data },
    { status: 201 }
  );
}
