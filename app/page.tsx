// app/page.tsx ou app/index.tsx (dependendo de como o Next.js está configurado)
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Index(props: { searchParams: Promise<Message> }) {
	const searchParams = await props.searchParams;
	return (
	  <div className="flex flex-col items-center justify-center min-h-screen">
		<form className="flex-1 flex flex-col min-w-64 w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
		  <h1 className="text-2xl font-medium mb-4 text-white">Sign in</h1>
		  <p className="text-sm text-white mb-4">
			Don't have an account?{" "}
			<Link className="text-white font-medium underline" href="/sign-up">
			  Sign up
			</Link>
		  </p>
		  <div className="flex flex-col gap-2">
			<Label htmlFor="email" className="text-white">Email</Label>
			<Input name="email" placeholder="" required />
			<div className="flex justify-between items-center">
			  <Label htmlFor="password" className="text-white">Password</Label>
			</div>
			<Input
			  type="password"
			  name="password"
			  required
			/>
			<SubmitButton pendingText="Signing In..." formAction={signInAction}>
			  Sign in
			</SubmitButton>
			<FormMessage message={searchParams} />
		  </div>
		</form>
	  </div>
	);
  }
  