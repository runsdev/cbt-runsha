"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Tables } from "@/types/database.types";

import {
  ArrowLeft,
  BarChart3,
  Book,
  Clock,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  XCircle,
  Users,
  BrainCircuit,
} from "lucide-react";

interface QuestionWithChoices extends Tables<"questions"> {
  choices: Tables<"choices">[] | null;
}

interface AnswerWithQuestion {
  answer: Tables<"answers">;
  question: QuestionWithChoices | null;
  correction: Tables<"correction_table"> | null;
  isCorrect: boolean;
}

interface TestSessionWithDetails extends Tables<"test_sessions"> {
  team: Tables<"teams"> | null;
  test: Tables<"tests"> | null;
  score: Tables<"scores"> | null;
}

interface QuestionStats {
  questionId: number;
  questionText: string;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  correctRate: number;
  difficultyRating: "Easy" | "Medium" | "Hard" | "Very Hard";
  type: string;
  points: number | null;
  isOutlier: boolean;
}

interface TestInsights {
  totalSessions: number;
  averageScore: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  standardDeviation: number;
  topPerformers: TestSessionWithDetails[];
  lowPerformers: TestSessionWithDetails[];
  questionStats: QuestionStats[];
  outlierQuestions: QuestionStats[];
  testDuration: number | null;
}

export default function TestInsightsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const router = useRouter();
  const [testData, setTestData] = useState<Tables<"tests"> | null>(null);
  const [insights, setInsights] = useState<TestInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "questions" | "sessions"
  >("overview");

  useEffect(() => {
    async function fetchTestInsights() {
      setIsLoading(true);
      try {
        const supabase = await createClient();

        const {
          data: { session: authSession },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError || !authSession?.user) {
          router.push(
            "/sign-in?next=" + encodeURIComponent(window.location.pathname)
          );
          return;
        }

        // Get test details
        const { data: testData, error: testError } = await supabase
          .from("tests")
          .select("*")
          .eq("slug", params.slug)
          .single();

        if (testError || !testData) {
          setError("Test not found");
          setIsLoading(false);
          return;
        }

        setTestData(testData);

        // Get all test sessions for this test
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("test_sessions")
          .select(
            `
            *,
            team:team_id (*),
            test:test_id (*),
            score:scores!scores_session_id_fkey (*)
          `
          )
          .eq("test_id", testData.id)
          .eq("status", "finished");

        if (sessionsError) {
          setError("Failed to load test sessions");
          setIsLoading(false);
          return;
        }

        // Get all scores for this test
        const { data: scoresData, error: scoresError } = await supabase
          .from("scores")
          .select("*")
          .eq("test_id", testData.id);

        if (scoresError) {
          console.error("Error fetching scores:", scoresError);
        }

        // Get all questions for this test
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select(`*, choices(*)`)
          .eq("test_id", testData.id);

        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
        }

        // Get all answers for these test sessions
        const sessionIds = sessionsData?.map((session) => session.id) || [];
        const { data: answersData, error: answersError } = await supabase
          .from("answers")
          .select("*")
          .in("test_session_id", sessionIds);

        if (answersError) {
          console.error("Error fetching answers:", answersError);
        }

        // Get all corrections
        const { data: correctionsData, error: correctionsError } =
          await supabase.from("correction_table").select("*");

        if (correctionsError) {
          console.error("Error fetching corrections:", correctionsError);
        }

        // Process the data to generate insights
        if (
          scoresData &&
          sessionsData &&
          questionsData &&
          answersData &&
          correctionsData
        ) {
          // Prepare sessions with scores
          const sessions = sessionsData.map((session) => {
            const sessionScore = scoresData.find(
              (score) => score.session_id === session.id
            );
            return {
              ...session,
              score: sessionScore || null,
            };
          });

          // Calculate score statistics
          const scores = scoresData
            .map((s) => s.score || 0)
            .filter((score) => score !== null);
          const averageScore =
            scores.length > 0
              ? scores.reduce((a, b) => a + b, 0) / scores.length
              : 0;
          const sortedScores = [...scores].sort((a, b) => a - b);
          const medianScore =
            sortedScores.length > 0
              ? sortedScores.length % 2 === 0
                ? (sortedScores[sortedScores.length / 2 - 1] +
                    sortedScores[sortedScores.length / 2]) /
                  2
                : sortedScores[Math.floor(sortedScores.length / 2)]
              : 0;
          const highestScore =
            sortedScores.length > 0 ? sortedScores[sortedScores.length - 1] : 0;
          const lowestScore = sortedScores.length > 0 ? sortedScores[0] : 0;

          // Calculate standard deviation
          const variance =
            scores.length > 0
              ? scores.reduce((a, b) => a + Math.pow(b - averageScore, 2), 0) /
                scores.length
              : 0;
          const standardDeviation = Math.sqrt(variance);

          // Identify top and low performers
          const sortedSessions = [...sessions].sort(
            (a, b) => (b.score?.score || 0) - (a.score?.score || 0)
          );
          const topPerformers = sortedSessions.slice(0, 5);
          const lowPerformers = [...sortedSessions].reverse().slice(0, 5);

          // Calculate question statistics
          const questionStats: QuestionStats[] = questionsData.map(
            (question) => {
              const questionAnswers = answersData.filter(
                (a) => a.question_id === question.id
              );
              const totalAttempts = questionAnswers.length;

              // Count correct answers
              let correctAttempts = 0;

              questionAnswers.forEach((answer) => {
                let isCorrect = false;

                if (answer.choice_id && correctionsData) {
                  isCorrect = correctionsData.some(
                    (c) => c.choice_id === answer.choice_id
                  );
                } else if (answer.answer_text && correctionsData) {
                  isCorrect = correctionsData.some(
                    (c) =>
                      c.answer_text &&
                      answer.answer_text &&
                      c.answer_text.toLowerCase() ===
                        answer.answer_text.toLowerCase()
                  );
                }

                if (isCorrect) correctAttempts++;
              });

              const incorrectAttempts = totalAttempts - correctAttempts;
              const correctRate =
                totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

              // Determine difficulty rating
              let difficultyRating: "Easy" | "Medium" | "Hard" | "Very Hard" =
                "Medium";
              if (correctRate >= 0.8) difficultyRating = "Easy";
              else if (correctRate >= 0.6) difficultyRating = "Medium";
              else if (correctRate >= 0.3) difficultyRating = "Hard";
              else difficultyRating = "Very Hard";

              return {
                questionId: question.id,
                questionText: question.question_text,
                totalAttempts,
                correctAttempts,
                incorrectAttempts,
                correctRate,
                difficultyRating,
                type: question.question_type,
                points: question.points,
                isOutlier: false, // Will be calculated later
              };
            }
          );

          // Identify outliers (questions with unusual correct/incorrect ratios)
          const correctRates = questionStats.map((q) => q.correctRate);
          const avgCorrectRate =
            correctRates.reduce((a, b) => a + b, 0) / correctRates.length;
          const correctRateStdDev = Math.sqrt(
            correctRates.reduce(
              (a, b) => a + Math.pow(b - avgCorrectRate, 2),
              0
            ) / correctRates.length
          );

          // Mark questions as outliers if their correct rate is more than 2 standard deviations from the mean
          questionStats.forEach((question) => {
            if (
              Math.abs(question.correctRate - avgCorrectRate) >
              2 * correctRateStdDev
            ) {
              question.isOutlier = true;
            }
          });

          const outlierQuestions = questionStats.filter((q) => q.isOutlier);

          // Sort question stats by correct rate (ascending) to show most challenging first
          questionStats.sort((a, b) => a.correctRate - b.correctRate);

          setInsights({
            totalSessions: sessions.length,
            averageScore,
            medianScore,
            highestScore,
            lowestScore,
            standardDeviation,
            topPerformers,
            lowPerformers,
            questionStats,
            outlierQuestions,
            testDuration: testData.duration,
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error in test insights:", err);
        setError("An unexpected error occurred");
        setIsLoading(false);
      }
    }

    fetchTestInsights();
  }, [params.slug, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-secondary/20 to-background/95">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!testData || !insights) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background/95 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card shadow-sm rounded-lg p-6 border border-border/30">
            <p className="text-center text-red-600 dark:text-red-400">
              {error || "Test data not found"}
            </p>
            <button
              onClick={() => router.push(`/admin/cbt/results/${params.slug}`)}
              className="flex items-center mx-auto mt-4 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Test Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background/95 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[80%] mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/admin/cbt/results/${params.slug}`)}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Test Results
          </button>
          <h1 className="text-3xl font-bold tracking-tight">
            {testData.title} - Test Insights
          </h1>
          <p className="text-muted-foreground">
            Analyze performance patterns and question effectiveness
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm transition-colors
              ${
                activeTab === "overview"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 font-medium text-sm transition-colors
              ${
                activeTab === "questions"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Question Analysis
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 font-medium text-sm transition-colors
              ${
                activeTab === "sessions"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Session Stats
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg shadow-sm p-5 border border-border/30">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.totalSessions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-5 border border-border/30">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.averageScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-5 border border-border/30">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Highest Score
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.highestScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-5 border border-border/30">
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Test Duration
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.testDuration
                        ? `${insights.testDuration} min`
                        : "Unlimited"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Problematic Questions */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden mb-6 border border-border/30">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                  Most Challenging Questions
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                        <th className="py-3 px-4 font-medium">Question</th>
                        <th className="py-3 px-4 font-medium">Type</th>
                        <th className="py-3 px-4 font-medium">Correct Rate</th>
                        <th className="py-3 px-4 font-medium">Difficulty</th>
                        <th className="py-3 px-4 font-medium">Attempts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.questionStats.slice(0, 5).map((question) => (
                        <tr
                          key={question.questionId}
                          className="border-b border-border/20 hover:bg-muted/30"
                        >
                          <td className="py-3 px-4">
                            {question.questionText.length > 80
                              ? `${question.questionText.substring(0, 80)}...`
                              : question.questionText}
                          </td>
                          <td className="py-3 px-4 capitalize">
                            {question.type.replace("-", " ")}
                          </td>
                          <td className="py-3 px-4">
                            {(question.correctRate * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium
                              ${
                                question.difficultyRating === "Easy"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : question.difficultyRating === "Medium"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : question.difficultyRating === "Hard"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {question.difficultyRating}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {question.totalAttempts}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Outlier Questions */}
            {insights.outlierQuestions.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm overflow-hidden mb-6 border border-border/30">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <BrainCircuit className="w-5 h-5 mr-2 text-purple-500" />
                    Statistical Outliers
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    These questions have performance patterns that significantly
                    deviate from the average, which may indicate they are
                    exceptionally easy, difficult, or potentially problematic.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                          <th className="py-3 px-4 font-medium">Question</th>
                          <th className="py-3 px-4 font-medium">Type</th>
                          <th className="py-3 px-4 font-medium">
                            Correct Rate
                          </th>
                          <th className="py-3 px-4 font-medium">Analysis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insights.outlierQuestions.map((question) => (
                          <tr
                            key={question.questionId}
                            className="border-b border-border/20 hover:bg-muted/30"
                          >
                            <td className="py-3 px-4">
                              {question.questionText.length > 80
                                ? `${question.questionText.substring(0, 80)}...`
                                : question.questionText}
                            </td>
                            <td className="py-3 px-4 capitalize">
                              {question.type.replace("-", " ")}
                            </td>
                            <td className="py-3 px-4">
                              {(question.correctRate * 100).toFixed(1)}%
                            </td>
                            <td className="py-3 px-4">
                              {question.correctRate > 0.95
                                ? "Extremely easy - consider making more challenging"
                                : question.correctRate < 0.15
                                  ? "Extremely difficult - may need revision"
                                  : "Statistically unusual performance"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden mb-6 border border-border/30">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Top Performing Teams
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                        <th className="py-3 px-4 font-medium">Team</th>
                        <th className="py-3 px-4 font-medium">Score</th>
                        <th className="py-3 px-4 font-medium">
                          Submission Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.topPerformers.map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-border/20 hover:bg-muted/30"
                        >
                          <td className="py-3 px-4">
                            {session.team?.name || "Unknown Team"}
                          </td>
                          <td className="py-3 px-4">
                            {session.score?.score || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {session.end_time
                              ? new Date(session.end_time).toLocaleString()
                              : "Not completed"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "questions" && (
          <div className="bg-card rounded-xl shadow-sm overflow-hidden mb-6 border border-border/30">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Question Performance Analysis
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed breakdown of how students performed on each question,
                helping identify strengths and areas for improvement.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                      <th className="py-3 px-4 font-medium">Question</th>
                      <th className="py-3 px-4 font-medium">Type</th>
                      <th className="py-3 px-4 font-medium">Correct</th>
                      <th className="py-3 px-4 font-medium">Incorrect</th>
                      <th className="py-3 px-4 font-medium">Success Rate</th>
                      <th className="py-3 px-4 font-medium">Points</th>
                      <th className="py-3 px-4 font-medium">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.questionStats.map((question) => (
                      <tr
                        key={question.questionId}
                        className={`border-b border-border/20 hover:bg-muted/30 ${
                          question.isOutlier
                            ? "bg-amber-50/30 dark:bg-amber-900/10"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          {question.questionText.length > 60
                            ? `${question.questionText.substring(0, 60)}...`
                            : question.questionText}
                        </td>
                        <td className="py-3 px-4 capitalize">
                          {question.type.replace("-", " ")}
                        </td>
                        <td className="py-3 px-4 text-green-600 dark:text-green-400">
                          {question.correctAttempts}
                        </td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400">
                          {question.incorrectAttempts}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full ${
                                question.correctRate >= 0.7
                                  ? "bg-green-500"
                                  : question.correctRate >= 0.4
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${question.correctRate * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs mt-1 inline-block">
                            {(question.correctRate * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">{question.points || 0}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                            ${
                              question.difficultyRating === "Easy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : question.difficultyRating === "Medium"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : question.difficultyRating === "Hard"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {question.difficultyRating}
                          </span>
                          {question.isOutlier && (
                            <span className="ml-2 text-amber-600 dark:text-amber-400 text-xs font-medium">
                              Outlier
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <>
            {/* Score Distribution */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden mb-6 border border-border/30">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Score Distribution & Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-accent/30 rounded-lg p-5 border border-border/30">
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.averageScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-5 border border-border/30">
                    <p className="text-sm text-muted-foreground">
                      Median Score
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.medianScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-5 border border-border/30">
                    <p className="text-sm text-muted-foreground">
                      Standard Deviation
                    </p>
                    <p className="text-2xl font-bold">
                      {insights.standardDeviation.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-5 border border-border/30">
                    <p className="text-sm text-muted-foreground">Score Range</p>
                    <p className="text-2xl font-bold">
                      {insights.lowestScore.toFixed(1)} -{" "}
                      {insights.highestScore.toFixed(1)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The standard deviation of{" "}
                  {insights.standardDeviation.toFixed(2)} indicates
                  {insights.standardDeviation > 10
                    ? " a wide spread of scores, suggesting significant performance differences between teams."
                    : insights.standardDeviation > 5
                      ? " a moderate spread of scores among the teams."
                      : " that most teams scored relatively close to the average."}
                </p>
              </div>
            </div>

            {/* All Sessions */}
            <div className="bg-card rounded-xl shadow-sm overflow-hidden mb-6 border border-border/30">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  All Session Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                        <th className="py-3 px-4 font-medium">Team</th>
                        <th className="py-3 px-4 font-medium">Score</th>
                        <th className="py-3 px-4 font-medium">Start Time</th>
                        <th className="py-3 px-4 font-medium">
                          Submission Time
                        </th>
                        <th className="py-3 px-4 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...insights.topPerformers, ...insights.lowPerformers]
                        .filter(
                          (session, index, self) =>
                            index === self.findIndex((s) => s.id === session.id)
                        )
                        .sort(
                          (a, b) =>
                            (b.score?.score || 0) - (a.score?.score || 0)
                        )
                        .map((session) => {
                          // Calculate duration if both times exist
                          let duration = "";
                          if (session.start_time && session.end_time) {
                            const startTime = new Date(session.start_time);
                            const endTime = new Date(session.end_time);
                            const durationMs =
                              endTime.getTime() - startTime.getTime();
                            const minutes = Math.floor(durationMs / 60000);
                            const seconds = Math.floor(
                              (durationMs % 60000) / 1000
                            );
                            duration = `${minutes}m ${seconds}s`;
                          }

                          return (
                            <tr
                              key={session.id}
                              className="border-b border-border/20 hover:bg-muted/30"
                            >
                              <td className="py-3 px-4">
                                {session.team?.name || "Unknown Team"}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                {session.score?.score !== undefined &&
                                session.score?.score !== null
                                  ? session.score.score
                                  : "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                {session.start_time
                                  ? new Date(
                                      session.start_time
                                    ).toLocaleString()
                                  : "Not started"}
                              </td>
                              <td className="py-3 px-4">
                                {session.end_time
                                  ? new Date(session.end_time).toLocaleString()
                                  : "Not completed"}
                              </td>
                              <td className="py-3 px-4">{duration || "N/A"}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
