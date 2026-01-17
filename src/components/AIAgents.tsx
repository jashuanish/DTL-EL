"use client";

import { motion } from "framer-motion";
import { Brain, Lightbulb, Target, MessageCircle, Sparkles } from "lucide-react";

interface AgentProps {
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function AgentCard({ name, role, icon, color, glowColor, description, isActive, onClick }: AgentProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl p-6 glass transition-all duration-500 ${
        isActive ? "scale-105" : ""
      }`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}20 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            boxShadow: isActive ? `0 0 30px ${glowColor}40` : "none",
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        
        <h3 className="text-lg font-semibold mb-1" style={{ color }}>{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{role}</p>
        <p className="text-xs text-muted-foreground/80 leading-relaxed">{description}</p>
        
        {isActive && (
          <motion.div
            className="absolute top-4 right-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" style={{ color }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export const agents = [
  {
    id: "concept",
    name: "Concept Agent",
    role: "Visual Explanations",
    icon: <Lightbulb className="w-7 h-7" />,
    color: "#00d4ff",
    glowColor: "#00d4ff",
    description: "Breaks down complex concepts into visual, digestible explanations with diagrams and animations.",
  },
  {
    id: "practice",
    name: "Practice Agent",
    role: "Adaptive Problems",
    icon: <Target className="w-7 h-7" />,
    color: "#8b5cf6",
    glowColor: "#8b5cf6",
    description: "Generates personalized problem sets that adapt to your skill level in real-time.",
  },
  {
    id: "reflection",
    name: "Reflection Agent",
    role: "Feedback & Analysis",
    icon: <Brain className="w-7 h-7" />,
    color: "#00ff88",
    glowColor: "#00ff88",
    description: "Analyzes your learning patterns, identifies gaps, and provides actionable insights.",
  },
  {
    id: "mentor",
    name: "Mentor Agent",
    role: "Central AI Guide",
    icon: <MessageCircle className="w-7 h-7" />,
    color: "#feca57",
    glowColor: "#feca57",
    description: "Your personal AI mentor that orchestrates all agents and guides your learning journey.",
  },
];

export function AgentOrbit() {
  return (
    <div className="relative w-[400px] h-[400px]">
      <div className="absolute inset-0 rounded-full border border-white/5" />
      <div className="absolute inset-8 rounded-full border border-white/5" />
      <div className="absolute inset-16 rounded-full border border-white/5" />
      
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {agents.map((agent, index) => {
          const angle = (index * 90) * (Math.PI / 180);
          const radius = 160;
          const x = Math.cos(angle) * radius + 200 - 24;
          const y = Math.sin(angle) * radius + 200 - 24;
          
          return (
            <motion.div
              key={agent.id}
              className="absolute w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                left: x,
                top: y,
                background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
                boxShadow: `0 0 20px ${agent.glowColor}30`,
              }}
              whileHover={{ scale: 1.2 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div style={{ color: agent.color }}>{agent.icon}</div>
            </motion.div>
          );
        })}
      </motion.div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(139, 92, 246, 0.2))",
            boxShadow: "0 0 40px rgba(0, 212, 255, 0.3)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-10 h-10 text-cyan-400" />
        </motion.div>
      </div>
    </div>
  );
}

export function FloatingMentorPanel() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 w-80 glass rounded-2xl p-4 z-50"
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(254, 202, 87, 0.3), rgba(254, 202, 87, 0.1))",
          }}
        >
          <MessageCircle className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-yellow-400 mb-1">Mentor Agent</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Welcome back! Based on your progress, I recommend reviewing "Data Structures" before moving to algorithms.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors">
          Start Review
        </button>
        <button className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors">
          Later
        </button>
      </div>
    </motion.div>
  );
}
