import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/login/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-200 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Logged in as:&nbsp;
          <code className="font-bold">{user.email}</code>
        </p>

        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <form action={signOut}>
            <button className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Smart Bookmarks</h1>
        <p className="text-xl mb-8">Your curated list of important links.</p>

        {/* We will add the bookmarks list here in Day 2 */}
        <div className="p-6 border rounded-lg bg-gray-50/50 dashed-border">
          <p className="text italic">Bookmarks loading soon...</p>
        </div>
      </div>
    </div>
  );
}
