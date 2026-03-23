import { createClient } from "@/utils/supabase/server";
import AddBookmark from "@/components/AddBookmark";
import BookmarkList from "@/components/BookmarkList";
import { redirect } from "next/navigation";
import { signOut } from "@/app/login/actions";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Explicitly check for expired or invalid sessions
  if (error || !user) {
    redirect("/login");
  }

  // Additional security: verify session is still valid
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Smart Bookmarks
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                            transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Add Bookmark Section */}
          <div className="mb-10">
            <AddBookmark />
          </div>

          {/* Bookmarks List Section */}
          <div>
            <BookmarkList initialBookmarks={bookmarks || []} />
          </div>
        </div>
      </div>
    </main>
  );
}
