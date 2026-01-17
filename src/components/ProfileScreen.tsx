"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Target,
  Clock,
  Bell,
  Save,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Trophy,
  Flame,
  ChevronDown,
  Check,
  Plus,
  X,
} from "lucide-react";

type Profile = {
  id?: string;
  user_id: string;
  display_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  learning_goals: string[];
  preferred_topics: string[];
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  daily_goal_minutes: number;
  notifications_enabled: boolean;
};

type Stats = {
  totalXp: number;
  conceptsLearned: number;
  totalProblems: number;
  streak: number;
  accuracy: number;
};

const experienceLevels = [
  { value: "beginner", label: "Beginner", description: "Just starting out" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Solid foundation" },
  { value: "expert", label: "Expert", description: "Deep expertise" },
];

const dailyGoalOptions = [15, 30, 45, 60, 90, 120];

const topicSuggestions = [
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "System Design",
  "Web Development",
  "Database Design",
  "Cloud Computing",
  "DevOps",
  "Security",
  "Mobile Development",
];

export function ProfileScreen({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<Profile>({
    user_id: "",
    display_name: "",
    email: "",
    avatar_url: "",
    bio: "",
    learning_goals: [],
    preferred_topics: [],
    experience_level: "beginner",
    daily_goal_minutes: 30,
    notifications_enabled: true,
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [showExpDropdown, setShowExpDropdown] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let storedUserId = localStorage.getItem("neurlearn_user_id");
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem("neurlearn_user_id", storedUserId);
    }
    setUserId(storedUserId);
    fetchProfile(storedUserId);
    fetchStats(storedUserId);
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${uid}`);
      const data = await res.json();
      if (data.profile) {
        setProfile({
          ...data.profile,
          display_name: data.profile.display_name || "",
          email: data.profile.email || "",
          avatar_url: data.profile.avatar_url || "",
          bio: data.profile.bio || "",
          learning_goals: data.profile.learning_goals || [],
          preferred_topics: data.profile.preferred_topics || [],
        });
      } else {
        setProfile((prev) => ({ ...prev, user_id: uid }));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (uid: string) => {
    try {
      const res = await fetch(`/api/progress?userId=${uid}`);
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const method = profile.id ? "PUT" : "POST";
      const res = await fetch("/api/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          displayName: profile.display_name,
          email: profile.email,
          avatarUrl: profile.avatar_url,
          bio: profile.bio,
          learningGoals: profile.learning_goals,
          preferredTopics: profile.preferred_topics,
          experienceLevel: profile.experience_level,
          dailyGoalMinutes: profile.daily_goal_minutes,
          notificationsEnabled: profile.notifications_enabled,
        }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    if (newGoal.trim() && !profile.learning_goals.includes(newGoal.trim())) {
      setProfile((prev) => ({
        ...prev,
        learning_goals: [...prev.learning_goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (goal: string) => {
    setProfile((prev) => ({
      ...prev,
      learning_goals: prev.learning_goals.filter((g) => g !== goal),
    }));
  };

  const toggleTopic = (topic: string) => {
    setProfile((prev) => ({
      ...prev,
      preferred_topics: prev.preferred_topics.includes(topic)
        ? prev.preferred_topics.filter((t) => t !== topic)
        : [...prev.preferred_topics, topic],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Customize your learning experience
          </p>
        </motion.div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: <Trophy className="w-5 h-5" />, value: stats.totalXp, label: "Total XP", color: "#feca57" },
              { icon: <BookOpen className="w-5 h-5" />, value: stats.conceptsLearned, label: "Concepts", color: "#00d4ff" },
              { icon: <Target className="w-5 h-5" />, value: `${stats.accuracy}%`, label: "Accuracy", color: "#00ff88" },
              { icon: <Flame className="w-5 h-5" />, value: stats.streak, label: "Day Streak", color: "#ff6b6b" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl glass text-center"
              >
                <div
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Basic Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.display_name}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        display_name: e.target.value,
                      }))
                    }
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Experience Level
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowExpDropdown(!showExpDropdown)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-cyan-400/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">
                      {experienceLevels.find((l) => l.value === profile.experience_level)?.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {experienceLevels.find((l) => l.value === profile.experience_level)?.description}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showExpDropdown ? "rotate-180" : ""}`} />
                </button>
                {showExpDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl glass border border-white/10 z-10"
                  >
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => {
                          setProfile((prev) => ({
                            ...prev,
                            experience_level: level.value as Profile["experience_level"],
                          }));
                          setShowExpDropdown(false);
                        }}
                        className={`w-full px-4 py-3 rounded-lg text-left hover:bg-white/5 transition-colors ${
                          profile.experience_level === level.value ? "bg-cyan-400/10" : ""
                        }`}
                      >
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {level.description}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Learning Goals
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addGoal()}
                    placeholder="Add a learning goal..."
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/50 outline-none transition-colors text-sm"
                  />
                  <button
                    onClick={addGoal}
                    className="px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.learning_goals.map((goal, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="flex-1 text-sm">{goal}</span>
                      <button
                        onClick={() => removeGoal(goal)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                  {profile.learning_goals.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No goals yet. Add your first learning goal!
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Preferred Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {topicSuggestions.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      profile.preferred_topics.includes(topic)
                        ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Daily Goal
              </h2>
              <div className="flex flex-wrap gap-2">
                {dailyGoalOptions.map((mins) => (
                  <button
                    key={mins}
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        daily_goal_minutes: mins,
                      }))
                    }
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      profile.daily_goal_minutes === mins
                        ? "bg-amber-400/20 text-amber-400 border border-amber-400/50"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-violet-400" />
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Get reminders to learn
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      notifications_enabled: !prev.notifications_enabled,
                    }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    profile.notifications_enabled
                      ? "bg-violet-500"
                      : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      profile.notifications_enabled
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={saveProfile}
            disabled={saving}
            className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-cyan-400 to-violet-500 text-white hover:opacity-90"
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
