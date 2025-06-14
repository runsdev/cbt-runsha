import { Tables } from "@/types/database.types";

export type QuestionType = "multiple-choices" | "short-answer";

export interface FormErrors {
  [key: string]: string;
}

export interface TestState {
  testData: Tables<"tests">;
  questions: Tables<"questions">[];
  currentQuestion: Tables<"questions">;
  currentQuestionChoices: Tables<"choices">[];
  correctionTable?: Tables<"correction_table">;
  availableTests: Tables<"tests">[];
  isLoading: boolean;
  isSubmitting: boolean;
  currentStep: 'test-info' | 'questions' | 'review';
  errors: FormErrors;
  successMessage: string | null;
}

export type TestAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: FormErrors }
  | { type: 'SET_SUCCESS'; payload: string | null }
  | { type: 'SET_STEP'; payload: TestState['currentStep'] }
  | { type: 'UPDATE_TEST_DATA'; payload: Partial<Tables<"tests">> }
  | { type: 'SET_AVAILABLE_TESTS'; payload: Tables<"tests">[] }
  | { type: 'SET_CURRENT_QUESTION'; payload: Tables<"questions"> }
  | { type: 'SET_QUESTION_CHOICES'; payload: Tables<"choices">[] }
  | { type: 'SET_CORRECTION_TABLE'; payload: Tables<"correction_table"> | undefined }
  | { type: 'UPDATE_QUESTIONS'; payload: Tables<"questions">[] }
  | { type: 'ADD_QUESTION'; payload: Tables<"questions"> }
  | { type: 'REMOVE_QUESTION'; payload: number }
  | { type: 'RESET_CURRENT_QUESTION' };

  // Define action types for better type safety
export  type ExamTestAction = 
    | { type: 'SET_TEST'; payload: Tables<"tests"> }
    | { type: 'SET_QUESTIONS'; payload: Tables<"questions">[] }
    | { type: 'SET_CURRENT_QUESTION'; payload: number }
    | { type: 'SET_FLAGS'; payload: Tables<"flags">[] }
    | { type: 'TOGGLE_FLAG'; payload: string }
    | { type: 'SET_CHOICES'; payload: Tables<"choices">[] }
    | { type: 'SET_ANSWERS'; payload: Record<string, any> }
    | { type: 'SET_ANSWER'; payload: { questionId: number; value: any } }
    | { type: 'CLEAR_ANSWER'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'SET_SUBMIT_MODAL'; payload: boolean }
    | { type: 'SET_TIME_REMAINING'; payload: number }
    | { type: 'SET_SESSION'; payload: Tables<"test_sessions"> | null }
    | { type: 'SET_QUESTION_MD'; payload: string }
    | { type: 'SET_CHOICES_MD'; payload: string[] }
    | { type: 'SET_SHORT_ANSWER_ERROR'; payload: string }
    | { type: 'SET_SHORT_ANSWER_SAVED'; payload: boolean }
    | { type: 'SET_TEAM'; payload: Tables<"teams"> | null };
  
  // Define state interface
export  interface ExamTestState {
    test: Tables<"tests"> | null;
    teams: Tables<"teams"> | null;
    questions: Tables<"questions">[];
    currentQuestion: number;
    flags: Tables<"flags">[];
    choices: Tables<"choices">[];
    answers: Record<string, any>;
    loading: boolean;
    submitting: boolean;
    showSubmitModal: boolean;
    timeRemaining: number;
    testSession: Tables<"test_sessions"> | null;
    questionMD: string;
    choicesMD: string[];
    shortAnswerValidationError: string;
    shortAnswerSaved: boolean;
  }
  
