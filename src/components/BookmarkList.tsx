"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { deleteBookmark } from "@/app/actions"; // Import Server Action
import UpdateBookmark from "./UpdateBookmark";

type Bookmark = {
    id: number;
    title: string;
    url: string;
    user_id: string;
};

export default function BookmarkList({
    initialBookmarks,
}: {
    initialBookmarks: Bookmark[];
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const setupRealtime = async () => {
            const { data: { session }, } = await supabase.auth.getSession();

            if (!session) {
                return;
            }

            try {
                channel = supabase
                    .channel("user-bookmarks-sync-v2")
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "bookmarks",
                        },
                        (payload) => {
                            const eventType = payload.eventType?.toUpperCase() || "";

                            if (eventType === "INSERT") {
                                setBookmarks((prev) => {
                                    const updated = [payload.new as Bookmark, ...prev];
                                    return updated;
                                });
                            } else if (eventType === "DELETE") {
                                const deletedId = String((payload.old as Bookmark).id);
                                setBookmarks((prev) => {
                                    const updated = prev.filter(
                                        (bookmark) => String(bookmark.id) !== deletedId,
                                    );
                                    return updated;
                                });
                            } else if (eventType === "UPDATE") {
                                setBookmarks((prev) =>
                                    prev.map((bookmark) =>
                                        String(bookmark.id) === String((payload.new as Bookmark).id)
                                            ? (payload.new as Bookmark)
                                            : bookmark,
                                    ),
                                );
                            }
                        },
                    )
                    .subscribe();
            } catch (error) {
                console.log(error);
            }
        };

        setupRealtime();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [supabase, router]);

    return (
        <div className="w-full">
            <div className=" items-center justify-center gap-2 text-xs text-green-600 font-medium mb-8 bg-green-50 rounded-lg py-2 px-4 
            inline-flex">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                Your BookMarks
            </div>

            {bookmarks?.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No bookmarks yet. Start by adding your first bookmark above!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks?.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 
                            transition overflow-hidden p-5 flex flex-col">
                            {/* Link Section */}
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold text-base mb-3 hover:text-blue-700 hover:underline line-clamp-2 
                                wrap-break-words">

                                {item.title}
                            </a>

                            <p className="text-gray-500 text-xs mb-4 truncate">{item.url}</p>

                            {/* Actions Section */}
                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                {/* 1. Update Button Component */}
                                <UpdateBookmark bookmark={item} />

                                {/* 2. Delete Button Form */}
                                <form action={deleteBookmark} className="flex-1">
                                    <input type="hidden" name="id" value={item.id} />
                                    <button
                                        type="submit"
                                        className="w-full text-sm font-medium text-red-600 hover:text-red-700 bg-red-50
                                         hover:bg-red-100 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
