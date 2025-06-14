import { TestState, TestAction, ExamTestAction, ExamTestState } from "@/types";
import { Tables } from "@/types/database.types";

export const initialTestState: TestState = {
  testData: {
    id: 0,
    title: "",
    slug: "",
    description: null,
    duration: 60,
    instructions: null,
    password: null,
    start_time: null,
    end_time: null,
    created_at: null,
  },
  questions: [],
  currentQuestion: {
    id: 0,
    test_id: 0,
    question_text: "",
    question_mdx: null,
    question_type: "multiple-choices",
    points: 1,
    has_choices: true,
    next_question_id: null,
    minus: 1,
    validation_pattern: null,
  },
  currentQuestionChoices: [],
  correctionTable: undefined,
  availableTests: [],
  isLoading: false,
  isSubmitting: false,
  currentStep: 'test-info',
  errors: {},
  successMessage: null,
};

export function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'SET_ERROR':
      return { ...state, errors: action.payload };
    
    case 'SET_SUCCESS':
      return { ...state, successMessage: action.payload };
    
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_TEST_DATA':
      return { 
        ...state, 
        testData: { ...state.testData, ...action.payload },
        errors: {} 
      };
    
    case 'SET_AVAILABLE_TESTS':
      return { ...state, availableTests: action.payload };
    
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload, errors: {} };
    
    case 'SET_QUESTION_CHOICES':
      return { ...state, currentQuestionChoices: action.payload };
    
    case 'SET_CORRECTION_TABLE':
      return { ...state, correctionTable: action.payload };
    
    case 'UPDATE_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'ADD_QUESTION':
      return { 
        ...state, 
        questions: [...state.questions, action.payload] 
      };
    
    case 'REMOVE_QUESTION':
      return { 
        ...state, 
        questions: state.questions.filter(q => q.id !== action.payload) 
      };
    
    case 'RESET_CURRENT_QUESTION':
      return { 
        ...state, 
        currentQuestion: {
          id: 0,
          test_id: state.testData.id,
          question_text: "",
          question_mdx: null,
          question_type: "multiple-choices",
          points: 1,
          has_choices: true,
          next_question_id: null,
          minus: 1,
          validation_pattern: null,
        },
        currentQuestionChoices: [],
        correctionTable: undefined
      };
    
    default:
      return state;
  }
}


// Initialize state
const initialState: ExamTestState = {
  test: null,
  questions: [],
  currentQuestion: 0,
  flags: [],
  choices: [],
  answers: {},
  loading: false,
  submitting: false,
  showSubmitModal: false,
  timeRemaining: 0,
  testSession: null,
  questionMD: "",
  choicesMD: [],
  shortAnswerValidationError: "",
  shortAnswerSaved: false,
  teams: null,
};

// Create reducer function
function testReducerExam(state: ExamTestState, action: ExamTestAction): ExamTestState {
  switch (action.type) {
    case 'SET_TEST':
      return { ...state, test: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'SET_CURRENT_QUESTION':
      return { 
        ...state, 
        currentQuestion: action.payload,
        shortAnswerSaved: false,
        shortAnswerValidationError: ""
      };
    case 'SET_FLAGS':
      return { ...state, flags: action.payload };
    case 'TOGGLE_FLAG':
      const flagId = action.payload;
      const exists = state.flags.some(flag => flag.id === flagId);
      
      if (exists) {
        return { 
          ...state, 
          flags: state.flags.filter(flag => flag.id !== flagId) 
        };
      } else {
        // This is simplified and would need the actual flag object in real implementation
        return { 
          ...state, 
          flags: [...state.flags, { id: flagId } as Tables<"flags">] 
        };
      }
    case 'SET_CHOICES':
      return { ...state, choices: action.payload };
    case 'SET_ANSWERS':
      return { ...state, answers: action.payload };
    case 'SET_ANSWER':
      return { 
        ...state, 
        answers: { 
          ...state.answers, 
          [action.payload.questionId]: action.payload.value 
        } 
      };
    case 'CLEAR_ANSWER':
      const newAnswers = {...state.answers};
      delete newAnswers[action.payload];
      return { ...state, answers: newAnswers };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.payload };
    case 'SET_SUBMIT_MODAL':
      return { ...state, showSubmitModal: action.payload };
    case 'SET_TIME_REMAINING':
      return { ...state, timeRemaining: action.payload };
    case 'SET_SESSION':
      return { ...state, testSession: action.payload };
    case 'SET_QUESTION_MD':
      return { ...state, questionMD: action.payload };
    case 'SET_CHOICES_MD':
      return { ...state, choicesMD: action.payload };
    case 'SET_SHORT_ANSWER_ERROR':
      return { ...state, shortAnswerValidationError: action.payload };
    case 'SET_SHORT_ANSWER_SAVED':
      return { ...state, shortAnswerSaved: action.payload };
    case 'SET_TEAM':
      return { ...state, teams: action.payload };
    default:
      return state;
  }
}

export { testReducerExam, initialState };
export type { ExamTestState, ExamTestAction };