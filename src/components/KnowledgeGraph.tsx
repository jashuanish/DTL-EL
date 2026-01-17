"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  mastery: number;
  connections: string[];
}

const sampleNodes: Node[] = [
  { id: "1", label: "Data Structures", x: 400, y: 300, mastery: 85, connections: ["2", "3", "4"] },
  { id: "2", label: "Arrays", x: 250, y: 180, mastery: 95, connections: ["1", "5"] },
  { id: "3", label: "Linked Lists", x: 550, y: 180, mastery: 75, connections: ["1", "6"] },
  { id: "4", label: "Trees", x: 400, y: 450, mastery: 60, connections: ["1", "7", "8"] },
  { id: "5", label: "Sorting", x: 120, y: 280, mastery: 90, connections: ["2"] },
  { id: "6", label: "Stacks", x: 680, y: 280, mastery: 70, connections: ["3"] },
  { id: "7", label: "Binary Trees", x: 280, y: 550, mastery: 45, connections: ["4"] },
  { id: "8", label: "Graphs", x: 520, y: 550, mastery: 30, connections: ["4", "9"] },
  { id: "9", label: "DFS/BFS", x: 650, y: 450, mastery: 20, connections: ["8"] },
];

function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return "#00ff88";
  if (mastery >= 60) return "#00d4ff";
  if (mastery >= 40) return "#feca57";
  if (mastery >= 20) return "#8b5cf6";
  return "#ff6b6b";
}

function getMasteryGlow(mastery: number): string {
  const color = getMasteryColor(mastery);
  return `0 0 20px ${color}50, 0 0 40px ${color}20`;
}

interface KnowledgeGraphProps {
  onNodeClick?: (node: Node) => void;
}

export function KnowledgeGraph({ onNodeClick }: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes] = useState<Node[]>(sampleNodes);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.02);
      mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.02);
    }
  }, [mouseX, mouseY]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node.id);
    onNodeClick?.(node);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] rounded-2xl glass overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-radial-gradient" />
      
      <motion.svg
        className="absolute inset-0 w-full h-full"
        style={{ x: springX, y: springY }}
      >
        {nodes.map((node) =>
          node.connections.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId);
            if (!target || parseInt(node.id) > parseInt(targetId)) return null;
            
            const isHighlighted = hoveredNode === node.id || hoveredNode === targetId;
            
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke={isHighlighted ? "#00d4ff" : "rgba(255, 255, 255, 0.1)"}
                strokeWidth={isHighlighted ? 2 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            );
          })
        )}
      </motion.svg>
      
      <motion.div
        className="absolute inset-0"
        style={{ x: springX, y: springY }}
      >
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer"
            style={{
              left: node.x - 50,
              top: node.y - 25,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(node)}
          >
            <motion.div
              className={`relative px-4 py-2 rounded-xl text-center transition-all duration-300 ${
                selectedNode === node.id ? "ring-2 ring-cyan-400" : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${getMasteryColor(node.mastery)}20, ${getMasteryColor(node.mastery)}10)`,
                boxShadow: hoveredNode === node.id ? getMasteryGlow(node.mastery) : "none",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: getMasteryColor(node.mastery) }}
              >
                {node.label}
              </span>
              <div className="mt-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: getMasteryColor(node.mastery) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${node.mastery}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
            
            {hoveredNode === node.id && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg glass text-xs whitespace-nowrap z-10"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-muted-foreground">Mastery: </span>
                <span style={{ color: getMasteryColor(node.mastery) }}>{node.mastery}%</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      <div className="absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2 rounded-xl glass">
        <span className="text-xs text-muted-foreground">Mastery Level:</span>
        {[
          { color: "#ff6b6b", label: "Beginner" },
          { color: "#feca57", label: "Learning" },
          { color: "#00d4ff", label: "Proficient" },
          { color: "#00ff88", label: "Mastered" },
        ].map((level) => (
          <div key={level.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: level.color }} />
            <span className="text-xs" style={{ color: level.color }}>{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MiniKnowledgeGraph() {
  return (
    <div className="relative w-full h-48 rounded-xl glass overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        <line x1="60" y1="60" x2="120" y2="100" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1" />
        <line x1="60" y1="60" x2="100" y2="40" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1" />
        <line x1="120" y1="100" x2="180" y2="80" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
        <line x1="180" y1="80" x2="220" y2="120" stroke="rgba(0, 255, 136, 0.3)" strokeWidth="1" />
        
        <circle cx="60" cy="60" r="8" fill="rgba(0, 212, 255, 0.5)" />
        <circle cx="100" cy="40" r="6" fill="rgba(139, 92, 246, 0.5)" />
        <circle cx="120" cy="100" r="10" fill="rgba(0, 255, 136, 0.5)" />
        <circle cx="180" cy="80" r="7" fill="rgba(254, 202, 87, 0.5)" />
        <circle cx="220" cy="120" r="5" fill="rgba(255, 107, 107, 0.5)" />
      </svg>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        Knowledge Graph Preview
      </div>
    </div>
  );
}
