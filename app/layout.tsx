import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Natixis Shelf",
  description: "The best way for a circular economy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
 
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
			<nav className="w-full flex justify-center bg-transparent h-32">
  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
    {/* Adicionar logo centralizado */}
	<div className="flex justify-center items-center absolute left-1/2 transform -translate-x-1/2">
  <Link href="/protected">
    <img 
      src="images/logon.png" 
      alt="logo" 
      className="h-24 w-auto" 
    />
  </Link>
</div>

    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
  </div>
</nav>


              <div className="flex flex-col  max-w-5xl ">
                {children}
              </div>

             <footer className="footer-custom w-full flex items-center justify-center mx-auto text-center text-xs gap-10 py-16">
			 <p>
  Made by Diogo Matos, Luís Balsa, Miguel Biltes, Pedro Alves and Sheila Almeida.  <br /><br />
  <span className="font-bold">Natixis Hackaton 2024</span>
</p>
</footer>

            </div>
          </main>

      </body>
    </html>
  );
}
