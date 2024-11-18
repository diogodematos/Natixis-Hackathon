import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
	<form className="flex-1 flex flex-col min-w-64 items-center justify-center">
  <h1 className="text-3xl font-white font-bold text-white text-center">SIGN IN</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email" className="text-white" >Email</Label>
        <Input name="email" required />
        <div className="flex justify-between items-center">
		<Label htmlFor="password" className="text-white">Password</Label>
        </div>
        <Input
          type="password"
          name="password"

          required
        />
<SubmitButton
  pendingText="Signing In..."
  formAction={signInAction}
  className="bg-[#59247A] mt-10 text-white rounded-[70px] hover:bg-[#8240AC] focus:outline-none focus:ring-2 focus:ring-blue-300"
>
  ENTER
</SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
