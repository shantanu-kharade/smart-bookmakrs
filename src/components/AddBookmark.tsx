"use client";

import { useRef } from "react";
import { addBookmark } from "@/app/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 min-h-[44px] bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm whitespace-nowrap shadow-sm hover:shadow-md"
    >
      {pending ? "Adding..." : "Add Bookmark"}
    </button>
  );
}

export default function AddBookmark() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Add New Bookmark
      </h3>
      <form action={addBookmark} ref={formRef} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              name="title"
              required
              placeholder="e.g., Google"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              name="url"
              type="url"
              required
              placeholder="https://google.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
