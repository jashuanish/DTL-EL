import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Topic = {
  id: string;
  name: string;
  category: string;
  description: string;
  created_at: string;
};

export type Concept = {
  id: string;
  topic_id: string;
  title: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  order_index: number;
  created_at: string;
};

export type Problem = {
  id: string;
  topic_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  hint: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  topic_id: string;
  concepts_completed: number;
  problems_solved: number;
  problems_correct: number;
  xp_earned: number;
  streak_days: number;
  last_activity: string;
  created_at: string;
};
