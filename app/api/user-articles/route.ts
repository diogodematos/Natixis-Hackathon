import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
	const supabase = await createClient();

	// Get the logged-in user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError) {
		return NextResponse.json(
			{ message: "Error getting user", error: authError.message },
			{ status: 401 }
		);
	}

	if (!user) {
		return NextResponse.json(
			{ message: "User not authenticated" },
			{ status: 401 }
		);
	}

	// Retrieve the user's articles ordered by status and created_at
	const { data, error } = await supabase
		.from("articles")
		.select("*")
		.eq("user_id", user.id)
		.order("status", { ascending: true });

	if (error) {
		return NextResponse.json(
			{ message: "Error fetching articles", error: error.message },
			{ status: 500 }
		);
	}

	return NextResponse.json({ articles: data }, { status: 200 });
}
