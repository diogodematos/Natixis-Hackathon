"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const deleteItemAction = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    return console.error("Error deleting item:", error.message);
  }

  return redirect("/personal");
}

type Category = "Books" | "Baby Items" | "Electronics" | "Furniture" | "Toys" | "Tools" | "Sports Equipment";

export const deliverItemAction = async (id: string, category: Category, userId: string) => {
  const supabase = await createClient();

  console.log("Delivering arguments:", id, category, userId);

  // Atualiza o status do artigo para "unavailable"
  const { error: updateItemError } = await supabase
    .from("articles")
    .update({ status: "unavailable" })
    .eq("id", id);

  if (updateItemError) {
    console.error("Error updating item:", updateItemError.message);
    return { success: false, message: "Error updating item" };
  }

  // Obtém o valor de CO2 da categoria
  const categoryValues = {
    "Books": 0.5,
    "Baby Items": 1.5,
    "Electronics": 10,
    "Furniture": 15,
    "Toys": 2,
    "Tools": 8,
    "Sports Equipment": 5
  };

  const co2Value = categoryValues[category];

  // Get the user's current CO2 value and points
  const { data: userData, error: userError } = await supabase
    .from("user_profile")
    .select("total_co2_saved, points")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user's CO2:", userError?.message || "No data");
    return { success: false, message: "Error fetching user's CO2" };
  }

  const userCo2 = userData.total_co2_saved + co2Value;
  const userPoints = userData.points + 1;

  // Update the user's CO2
  const { error: updateUserError } = await supabase
    .from("user_profile")
    .update({ total_co2_saved: userCo2, points: userPoints })
    .eq("id", userId);

  if (updateUserError) {
    console.error("Error updating user's CO2:", updateUserError.message);
    return { success: false, message: "Error updating user's CO2" };
  }

  return { success: true, message: "Item delivered" };
};

