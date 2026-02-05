"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Job Scheduler Dashboard</h1>

      <p className="mb-6 text-center text-gray-700">
        Welcome! You can view all jobs, filter them, and run pending jobs from the Jobs page.
      </p>

      <Link href="/jobs">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Go to Jobs
        </button>
      </Link>
    </div>
  );
}
