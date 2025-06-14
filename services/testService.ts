import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

const supabase = createClient();

export const testService = {
  async fetchTestBySlug(slug: string) {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("slug", slug)
      .single<Tables<"tests">>();
      
    if (error) throw error;
    return data;
  },
  
  async fetchQuestionsByTestId(testId: number) {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", testId)
      .order("id", { ascending: true })
      .returns<Tables<"questions">[]>();
      
    if (error) throw error;
    return data;
  },
  
  async fetchChoicesByQuestionId(questionId: number) {
    const { data, error } = await supabase
      .from("choices")
      .select("*")
      .eq("question_id", questionId)
      .returns<Tables<"choices">[]>();
      
    if (error) throw error;
    return data;
  },
  
  async saveAnswer(sessionId: string, questionId: number, teamId: string, choiceId?: number, answerText?: string) {
    const { error } = await supabase
      .from("answers")
      .upsert({
        id: `${sessionId}-${questionId}`,
        test_session_id: sessionId,
        question_id: questionId,
        choice_id: choiceId,
        answer_text: answerText,
        team_id: teamId,
        timestamp: new Date().toISOString(),
      });
      
    if (error) throw error;
  },
  
  async deleteAnswer(sessionId: string, questionId: number) {
    const { error } = await supabase
      .from("answers")
      .delete()
      .eq("id", `${sessionId}-${questionId}`);
      
    if (error) throw error;
  },
  
  async toggleFlag(flagId: string, teamId: string) {
    const { data, error } = await supabase
      .from("flags")
      .select()
      .eq("id", flagId);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      const { error: deleteError } = await supabase
        .from("flags")
        .delete()
        .eq("id", flagId);
        
      if (deleteError) throw deleteError;
      return false; // Flag removed
    } else {
      const { error: insertError } = await supabase
        .from("flags")
        .insert({
          id: flagId,
          team_id: teamId,
        });
        
      if (insertError) throw insertError;
      return true; // Flag added
    }
  },
  
  async getFlaggedQuestions(sessionId: string, teamId: string) {
    const { data, error } = await supabase
      .from("flags")
      .select()
      .textSearch("id", `${sessionId}-${teamId}`);
      
    if (error) throw error;
    return data || [];
  },
  
  async submitTest(sessionId: string, answers: Record<string, any>) {
    const { error } = await supabase
      .from("test_sessions")
      .update({
        status: "finished",
        end_time: new Date().toISOString(),
        answers: answers,
      })
      .eq("id", sessionId);
      
    if (error) throw error;
  }
};