import { Tables } from "@/types/database.types";
import { FormErrors } from "@/types";

export const validateTestData = (data: Partial<Tables<"tests">>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!data.title?.trim()) {
    errors.title = "Title is required";
  }
  
  if (!data.duration || data.duration <= 0) {
    errors.duration = "Duration must be a positive number";
  }
  
  return errors;
};

export const validateQuestion = (question: Partial<Tables<"questions">>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!question.question_text?.trim()) {
    errors.question_text = "Question text is required";
  }
  
  if (!question.points || question.points <= 0) {
    errors.points = "Points must be a positive number";
  }
  
  return errors;
};

export const validateChoices = (
  choices: Partial<Tables<"choices">>[],
  correctionTable?: Tables<"correction_table">
): FormErrors => {
  const errors: FormErrors = {};
  
  if (choices.length < 2) {
    errors.choices = "At least two choices are required";
  }
  
  if (choices.some(c => !c.choice_text?.trim())) {
    errors.choice_text = "All choices must have text";
  }
  
  if (!correctionTable?.choice_id) {
    errors.correct_answer = "Please select a correct answer";
  }
  
  return errors;
};

export const validateShortAnswer = (
  correctionTable?: Tables<"correction_table">
): FormErrors => {
  const errors: FormErrors = {};
  
  if (!correctionTable?.answer_text?.trim()) {
    errors.answer_text = "Answer text is required";
  }
  
  return errors;
};