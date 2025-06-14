"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Lock,
  Edit,
  Settings,
  SearchIcon,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { Tables } from "@/types/database.types";

export default function ManageTestPasswordsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Tables<"tests">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTests() {
      const supabase = await createClient();
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session?.user) {
        router.push(
          "/sign-in?next=" + encodeURIComponent(window.location.pathname)
        );
        return;
      }

      // Here you would typically check if the user has admin rights

      const { data, error: fetchError } = await supabase
        .from("tests")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError("Failed to load tests");
        setIsLoading(false);
        return;
      }

      if (!data) {
        setError("No tests found");
        setIsLoading(false);
        return;
      }

      setTests(data);
      setIsLoading(false);
    }

    fetchTests();
  }, [router]);

  const filteredTests = tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90%] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Admin Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Manage Test Passwords
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set or update passwords for your tests
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Search and filter */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search tests..."
                className="bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tests list */}
          {filteredTests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No tests found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Test Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {test.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ID: {test.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {test.description || "No description"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {test.password !== null ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full flex items-center w-fit">
                            <Lock className="w-3 h-3 mr-1" />
                            Password protected
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full flex items-center w-fit">
                            <KeyRound className="w-3 h-3 mr-1" />
                            No password
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/cbt/set-password/${test.slug}`}
                          className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 flex items-center justify-end"
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          {test.password !== null
                            ? "Update Password"
                            : "Set Password"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
