import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import UserPoints from "./userPoints";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Quando o usuário está logado
  if (user) {
    // Buscar os valores de pontos e CO2 diretamente da base de dados
    const { data: profile, error } = await supabase
      .from("user_profile")
      .select("points, total_co2_saved")
      .eq("id", user.id)
      .single(); // Busca um único registro para o usuário atual

    if (error) {
      console.error("Erro ao buscar perfil do usuário:", error.message);
    }

    return (
      <div className="flex items-center gap-4">
        {/* Exibir imagem do usuário, ou imagem padrão */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#2987A0]">
          <Link href="/personal">
            <img
              src={user.user_metadata?.avatar_url || "/images/default-avatar.png"} // Imagem do usuário ou padrão
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        <UserPoints />
      </div>
    );
  }
}
