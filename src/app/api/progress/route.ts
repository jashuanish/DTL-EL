import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "anonymous";

    const { data: progress, error } = await supabase
      .from("user_progress")
      .select("*, topics(*)")
      .eq("user_id", userId);

    if (error) throw error;

    const totalXp = progress?.reduce((sum, p) => sum + (p.xp_earned || 0), 0) || 0;
    const totalProblems = progress?.reduce((sum, p) => sum + (p.problems_solved || 0), 0) || 0;
    const totalCorrect = progress?.reduce((sum, p) => sum + (p.problems_correct || 0), 0) || 0;
    const conceptsLearned = progress?.reduce((sum, p) => sum + (p.concepts_completed || 0), 0) || 0;
    const maxStreak = progress?.reduce((max, p) => Math.max(max, p.streak_days || 0), 0) || 0;

    return NextResponse.json({
      progress: progress || [],
      stats: {
        totalXp,
        totalProblems,
        totalCorrect,
        accuracy: totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0,
        conceptsLearned,
        streak: maxStreak,
        topicsStudied: progress?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, topicId, conceptsCompleted, problemsSolved, problemsCorrect, xpEarned } = await request.json();

    const userIdToUse = userId || "anonymous";

    const { data: existing } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userIdToUse)
      .eq("topic_id", topicId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("user_progress")
        .update({
          concepts_completed: (existing.concepts_completed || 0) + (conceptsCompleted || 0),
          problems_solved: (existing.problems_solved || 0) + (problemsSolved || 0),
          problems_correct: (existing.problems_correct || 0) + (problemsCorrect || 0),
          xp_earned: (existing.xp_earned || 0) + (xpEarned || 0),
          last_activity: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ progress: data });
    } else {
      const { data, error } = await supabase
        .from("user_progress")
        .insert({
          user_id: userIdToUse,
          topic_id: topicId,
          concepts_completed: conceptsCompleted || 0,
          problems_solved: problemsSolved || 0,
          problems_correct: problemsCorrect || 0,
          xp_earned: xpEarned || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ progress: data });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
