import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

const supabase = createClient();

export const apiService = {
  // Test related APIs
  async fetchAvailableTests() {
    const { data, error } = await supabase
      .from("tests")
      .select()
      .returns<Tables<"tests">[]>();
    
    if (error) throw error;
    return data;
  },
  
  async fetchTestById(testId: number) {
    const { data, error } = await supabase
      .from("tests")
      .select()
      .eq("id", testId)
      .single<Tables<"tests">>();
    
    if (error) throw error;
    return data;
  },
  
  async saveTest(test: Partial<Tables<"tests">>) {
    if (test.id && test.id > 0) {
      const { data, error } = await supabase
        .from("tests")
        .update(test)
        .eq("id", test.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("tests")
        .insert([test])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  // Question related APIs
  async fetchQuestionsByTestId(testId: number) {
    const { data, error } = await supabase
      .from("questions")
      .select()
      .eq("test_id", testId)
      .returns<Tables<"questions">[]>();
    
    if (error) throw error;
    return data;
  },
  
  async fetchChoicesByQuestionId(questionId: number) {
    const { data, error } = await supabase
      .from("choices")
      .select()
      .eq("question_id", questionId)
      .returns<Tables<"choices">[]>();
    
    if (error) throw error;
    return data;
  },
  
  async fetchCorrectionTable(questionId: number) {
    const { data, error } = await supabase
      .from("correction_table")
      .select()
      .eq("question_id", questionId)
      .single<Tables<"correction_table">>();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data;
  },
  
  async saveQuestion(question: Partial<Tables<"questions">>) {
    if (question.id && question.id > 0) {
      const { data, error } = await supabase
        .from("questions")
        .update(question)
        .eq("id", question.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("questions")
        .insert([question])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  async saveChoices(choices: Partial<Tables<"choices">>[]) {
    const { data, error } = await supabase
      .from("choices")
      .upsert(choices)
      .select();
    
    if (error) throw error;
    return data;
  },
  
  async deleteChoice(choiceId: number) {
    const { error } = await supabase
      .from("choices")
      .delete()
      .eq("id", choiceId);
    
    if (error) throw error;
  },
  
  async saveCorrectionTable(correction: Partial<Tables<"correction_table">>) {
    const { data, error } = await supabase
      .from("correction_table")
      .upsert([correction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // MDX processing
  async processMdx(content: string) {
    const response = await fetch("/api/mdx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to compile MDX: ${response.statusText}`);
    }
    
    const { code } = await response.json();
    return code;
  },

  async deleteQuestion(questionId: number) {
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);
    
    if (error) throw error;
  },
};