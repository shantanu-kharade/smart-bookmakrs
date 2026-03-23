"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User is not authenticated");
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  if (!title || !url) {
    return;
  }

  if (title.length > 500 || url.length > 2048) {
    throw new Error("Input exceeds maximum length");
  }

  if (!isValidUrl(url)) {
    throw new Error("URL must be a valid http or https URL");
  }
  const { error } = await supabase.from("bookmarks").insert({
    title,
    url,
    user_id: user.id,
  });
  if (error) {
    throw new Error("Failed to add bookmark");
  }
  revalidatePath("/");
}

export async function deleteBookmark(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User is not authenticated");
  }
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Bookmark ID is required");
  }
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .match({ id, user_id: user.id });
  if (error) {
    throw new Error("Failed to delete bookmark");
  }
  revalidatePath("/");
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateBookmark(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("User is not authenticated");
  }
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  if (!id || !title || !url) {
    return;
  }
  if (title.length > 500 || url.length > 2048) {
    throw new Error("Input exceeds maximum length");
  }
  if (!isValidUrl(url)) {
    throw new Error("URL must be a valid http or https URL");
  }
  const { error } = await supabase
    .from("bookmarks")
    .update({
      title,
      url,
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    throw new Error("Failed to update bookmark");
  }
  revalidatePath("/");
}
