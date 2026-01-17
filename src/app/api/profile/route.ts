import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      displayName,
      email,
      avatarUrl,
      bio,
      learningGoals,
      preferredTopics,
      experienceLevel,
      dailyGoalMinutes,
      notificationsEnabled,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Profile already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        display_name: displayName,
        email,
        avatar_url: avatarUrl,
        bio,
        learning_goals: learningGoals || [],
        preferred_topics: preferredTopics || [],
        experience_level: experienceLevel || "beginner",
        daily_goal_minutes: dailyGoalMinutes || 30,
        notifications_enabled: notificationsEnabled ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      displayName,
      email,
      avatarUrl,
      bio,
      learningGoals,
      preferredTopics,
      experienceLevel,
      dailyGoalMinutes,
      notificationsEnabled,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (displayName !== undefined) updateData.display_name = displayName;
    if (email !== undefined) updateData.email = email;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    if (bio !== undefined) updateData.bio = bio;
    if (learningGoals !== undefined) updateData.learning_goals = learningGoals;
    if (preferredTopics !== undefined) updateData.preferred_topics = preferredTopics;
    if (experienceLevel !== undefined) updateData.experience_level = experienceLevel;
    if (dailyGoalMinutes !== undefined) updateData.daily_goal_minutes = dailyGoalMinutes;
    if (notificationsEnabled !== undefined) updateData.notifications_enabled = notificationsEnabled;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!existing) {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          display_name: displayName,
          email,
          avatar_url: avatarUrl,
          bio,
          learning_goals: learningGoals || [],
          preferred_topics: preferredTopics || [],
          experience_level: experienceLevel || "beginner",
          daily_goal_minutes: dailyGoalMinutes || 30,
          notifications_enabled: notificationsEnabled ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ profile: data }, { status: 201 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
