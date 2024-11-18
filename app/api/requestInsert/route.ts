import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json(); // Lê o corpo da requisição

  const { Message } = body;

  // Verifica se a mensagem foi fornecida
  if (!Message) {
    return NextResponse.json(
      { message: "The Item's name is mandatory." },
      { status: 400 }
    );
  }

  // Obtém o usuário logado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Erro de autenticação:", authError);
    return NextResponse.json(
      { message: "Erro ao obter usuário", error: authError?.message },
      { status: 401 }
    );
  }

  const user_email = user.email; // Obtém o e-mail do usuário
  console.log("Usuário:", user_email);

  // Insere os dados na tabela `requests`, incluindo o status "pending"
  const { data, error } = await supabase.from("request").insert([
    {
      Message,
      user_email, // Armazena o e-mail do usuário
      status: "pending", // Adicionando o status como "pending"
    },
  ]);

  if (error) {
    console.log("Erro ao inserir dados:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }

  console.log("Dados inseridos:", data);
  return NextResponse.json(
    { message: "SUCCESS!", data },
    { status: 201 }
  );
}
