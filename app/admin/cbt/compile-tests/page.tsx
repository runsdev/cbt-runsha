"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";
import { elevateUserToAdmin, getAllEmails } from "@/lib/user-services";

export default function DashboardPage() {
  const supabase = createClient();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [compilingTestId, setCompilingTestId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [testsData, setTestsData] = useState<Tables<"tests">[] | null>(null);
  const [questionsData, setQuestionsData] = useState<
    Tables<"questions">[] | null
  >(null);
  const [choicesData, setChoicesData] = useState<Tables<"choices">[] | null>(
    null
  );
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
      setIsPageLoading(true);
      try {
        const emails = await getAllEmails();
        setEmails(emails);

        const { data: testsData } = await supabase
          .from("tests")
          .select()
          .returns<Tables<"tests">[]>();

        const { data: questionsData } = await supabase
          .from("questions")
          .select()
          .returns<Tables<"questions">[]>();

        const { data: choicesData } = await supabase
          .from("choices")
          .select()
          .returns<Tables<"choices">[]>();

        if (testsData && questionsData && choicesData) {
          setTestsData(testsData);
          setQuestionsData(questionsData);
          setChoicesData(choicesData);
          console.log(testsData, questionsData, choicesData);
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsPageLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleElevateUser = async (email: string) => {
    setIsActionLoading(true);
    setError("");

    try {
      await elevateUserToAdmin(email);
      setSelectedEmail("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to elevate user"
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  async function handleTestCompile(testId: number) {
    setCompilingTestId(testId);
    setError("");

    const questions = questionsData?.filter(
      (question) => question.test_id === testId
    );

    if (!questions || questions.length === 0) {
      setCompilingTestId(null);
      return;
    }

    try {
      // Process all questions in sequence
      for (const question of questions) {
        try {
          const response = await fetch("/api/mdx", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: question.question_text }),
          });

          if (!response.ok) {
            throw new Error(`Failed to compile MDX: ${response.statusText}`);
          }

          const { code } = await response.json();

          const { error: updateError } = await supabase
            .from("questions")
            .update({ question_mdx: code })
            .match({ id: question.id });

          if (updateError) {
            throw new Error(
              `Failed to update question: ${updateError.message}`
            );
          }

          console.log("Question compiled:", question.id);

          if (
            question.question_type === "multiple-choices" ||
            question.question_type === "multiple-answers"
          ) {
            await handleChoicesCompile(question.id);
          }
        } catch (error) {
          console.error("Error:", error);
          setError(
            error instanceof Error ? error.message : "Failed to compile MDX"
          );
          break;
        }
      }
    } finally {
      setCompilingTestId(null);
    }
  }

  async function handleChoicesCompile(questionId: number) {
    const choices = choicesData?.filter(
      (choice) => choice.question_id === questionId
    );

    if (!choices || choices.length === 0) {
      return;
    }

    // Process all choices sequentially for better error handling
    for (const choice of choices) {
      try {
        const response = await fetch("/api/mdx", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: choice.choice_text }),
        });

        if (!response.ok) {
          throw new Error(`Failed to compile MDX: ${response.statusText}`);
        }

        const { code } = await response.json();

        const { error: updateError } = await supabase
          .from("choices")
          .update({ choice_mdx: code })
          .match({ id: choice.id });

        if (updateError) {
          throw new Error(`Failed to update choice: ${updateError.message}`);
        }

        console.log("Choice compiled:", choice.id);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to compile MDX"
        );
        break;
      }
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90%] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Test on-demand Compiler
            </h1>
            <p className="text-gray-600">
              Compile test questions to MDX format
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Tests
            </h2>
            <p className="text-sm text-gray-500">
              Select a test to compile its questions to MDX
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testsData?.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {test.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleTestCompile(test.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                        disabled={compilingTestId !== null}
                      >
                        {compilingTestId === test.id
                          ? "Compiling..."
                          : "Compile Test"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              User Permissions
            </h2>
            <p className="text-sm text-gray-500">
              Elevate a user to admin privileges
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-4">
              <select
                onChange={(e) => setSelectedEmail(e.target.value)}
                value={selectedEmail}
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isActionLoading}
              >
                <option value="">Select an email</option>
                {emails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleElevateUser(selectedEmail)}
                disabled={!selectedEmail || isActionLoading}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isActionLoading ? "Processing..." : "Elevate User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
