"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import PasswordInput from "@/components/PasswordInput";
import { Lock, ArrowLeft, Check, AlertCircle } from "lucide-react";

export default function TestPasswordPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
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
      // For simplicity, we're just checking if they're authenticated

      const { data: test, error: testError } = await supabase
        .from("tests")
        .select("title, description")
        .eq("slug", slug)
        .single();

      if (testError) {
        setError("Test not found");
        return;
      }

      setTestTitle(test.title);
      setTestDescription(test.description || "No description available");
      setIsLoading(false);
    }

    checkAdmin();
  }, [router, slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/set-test-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password");
      }

      setSuccess(true);
      // Clear form
      setPassword("");
      setConfirmPassword("");

      // Redirect back to test list after a short delay
      setTimeout(() => {
        router.push("/admin/cbt/set-password");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to tests
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <h1 className="text-xl font-bold">Set Password Protection</h1>
            </div>
            <p className="mt-2 text-white/80 text-sm">
              Add password protection to control access to this test
            </p>
          </div>

          {/* Test Info */}
          <div className="border-b dark:border-gray-700 px-6 py-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {testTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {testDescription}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-start">
                <Check className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">
                    Success!
                  </h3>
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    Password has been set successfully. Redirecting...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter test password"
                  error={error && !password ? "Password is required" : ""}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Create a secure password that will be required to access this
                  test
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm password"
                  error={
                    error && password !== confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
                  <span className="text-red-800 dark:text-red-300 text-sm">
                    {error}
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg mr-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || success}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Set Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
