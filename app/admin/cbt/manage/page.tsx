"use client";
import React, { useReducer, useEffect } from "react";
import { toast } from "sonner";
import { initialTestState, testReducer } from "@/reducers/testReducer";
import { apiService } from "@/services/api";
import TestInfoForm from "@/components/TestInfoForm";
import QuestionForm from "@/components/QuestionForm";
import QuestionsReview from "@/components/QuestionReview";
import TestCreationSteps from "@/components/TestCreationSteps";

export default function CreateTest() {
  const [state, dispatch] = useReducer(testReducer, initialTestState);

  useEffect(() => {
    const fetchAvailableTests = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const tests = await apiService.fetchAvailableTests();
        dispatch({ type: "SET_AVAILABLE_TESTS", payload: tests });
      } catch (error) {
        toast.error("Failed to fetch available tests");
        console.error(error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchAvailableTests();
  }, []);

  useEffect(() => {
    if (state.testData.start_time && state.testData.duration) {
      const startTime = new Date(state.testData.start_time);
      const endTime = new Date(
        startTime.getTime() + state.testData.duration * 60000
      );

      dispatch({
        type: "UPDATE_TEST_DATA",
        payload: { end_time: endTime.toISOString() },
      });
    }
  }, [state.testData.start_time, state.testData.duration]);

  const handleFetchTestData = async (testId: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const test = await apiService.fetchTestById(testId);
      dispatch({ type: "UPDATE_TEST_DATA", payload: test });

      const questions = await apiService.fetchQuestionsByTestId(testId);
      dispatch({ type: "UPDATE_QUESTIONS", payload: questions });

      if (questions.length > 0) {
        dispatch({ type: "SET_CURRENT_QUESTION", payload: questions[0] });

        const choices = await apiService.fetchChoicesByQuestionId(
          questions[0].id
        );
        dispatch({ type: "SET_QUESTION_CHOICES", payload: choices });

        const correction = await apiService.fetchCorrectionTable(
          questions[0].id
        );
        dispatch({ type: "SET_CORRECTION_TABLE", payload: correction! });
      }
    } catch (error) {
      toast.error("Failed to fetch test data");
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background/95 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[80%] mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Test</h1>

        <TestCreationSteps
          currentStep={state.currentStep}
          onChange={(step) => dispatch({ type: "SET_STEP", payload: step })}
        />

        {state.currentStep === "test-info" && (
          <TestInfoForm
            testData={state.testData}
            availableTests={state.availableTests}
            errors={state.errors}
            isLoading={state.isLoading}
            isSubmitting={state.isSubmitting}
            onSelectTest={handleFetchTestData}
            onUpdateTestData={(data) =>
              dispatch({ type: "UPDATE_TEST_DATA", payload: data })
            }
            onSave={async () => {
              dispatch({ type: "SET_SUBMITTING", payload: true });
              try {
                const savedTest = await apiService.saveTest(state.testData);
                dispatch({ type: "UPDATE_TEST_DATA", payload: savedTest });
                toast.success("Test information saved successfully");
                dispatch({ type: "SET_STEP", payload: "questions" });
              } catch (error) {
                toast.error("Failed to save test information");
                console.error(error);
              } finally {
                dispatch({ type: "SET_SUBMITTING", payload: false });
              }
            }}
          />
        )}

        {state.currentStep === "questions" && (
          <QuestionForm
            testId={state.testData.id}
            currentQuestion={state.currentQuestion}
            choices={state.currentQuestionChoices}
            correctionTable={state.correctionTable}
            errors={state.errors}
            isLoading={state.isLoading}
            isSubmitting={state.isSubmitting}
            dispatch={dispatch}
            onNext={() => {
              dispatch({ type: "SET_STEP", payload: "review" });
            }}
          />
        )}

        {state.currentStep === "review" && (
          <QuestionsReview
            questions={state.questions}
            isLoading={state.isLoading}
            onEditQuestion={async (questionId) => {
              dispatch({ type: "SET_LOADING", payload: true });

              try {
                const question = state.questions.find(
                  (q) => q.id === questionId
                );
                if (!question) throw new Error("Question not found");

                dispatch({ type: "SET_CURRENT_QUESTION", payload: question });

                const choices =
                  await apiService.fetchChoicesByQuestionId(questionId);
                dispatch({ type: "SET_QUESTION_CHOICES", payload: choices });

                const correction =
                  await apiService.fetchCorrectionTable(questionId);
                dispatch({
                  type: "SET_CORRECTION_TABLE",
                  payload: correction!,
                });

                dispatch({ type: "SET_STEP", payload: "questions" });
              } catch (error) {
                toast.error("Failed to load question details");
                console.error(error);
              } finally {
                dispatch({ type: "SET_LOADING", payload: false });
              }
            }}
            onRemoveQuestion={async (questionId) => {
              // Here you would typically show a confirmation dialog
              if (confirm("Are you sure you want to remove this question?")) {
                dispatch({ type: "REMOVE_QUESTION", payload: questionId });
                await apiService.deleteQuestion(questionId);
                toast.success("Question removed");
              }
            }}
            onFinish={async () => {
              toast.success("Test created successfully");
              // Here you might redirect to a test overview page or reset the form
            }}
          />
        )}
      </div>
    </div>
  );
}
