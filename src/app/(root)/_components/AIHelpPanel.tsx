"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, X, Sparkles } from "lucide-react";

const ACTIONS = [
  { id: "explain", label: "Explain Code", color: "from-blue-500 to-blue-600" },
  { id: "debug", label: "Debug & Fix", color: "from-red-500 to-red-600" },
  { id: "optimize", label: "Optimize", color: "from-green-500 to-green-600" },
];

function AIHelpPanel({ onClose }: { onClose: () => void }) {
  const { language, getCode } = useCodeEditorStore();
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState("");

  const handleAction = async (action: string) => {
    const code = getCode();
    if (!code) return;

    setIsLoading(true);
    setActiveAction(action);
    setResult("");

    try {
      const response = await fetch("/api/ai-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, action }),
      });

      const data = await response.json();
      setResult(data.result || data.error);
    } catch (error) {
      setResult("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-4 bg-[#1e1e2e] rounded-xl border border-purple-500/20 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white">AI Help</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="size-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        {ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction(action.id)}
            disabled={isLoading}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium text-white bg-gradient-to-r 
              ${action.color} opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && activeAction === action.id ? (
              <Loader2 className="size-3 animate-spin mx-auto" />
            ) : (
              action.label
            )}
          </motion.button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div className="bg-[#12121a] rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
          {result}
        </div>
      )}

      {!result && !isLoading && (
        <p className="text-xs text-gray-500 text-center">
          Select an action to get AI assistance for your code
        </p>
      )}
    </motion.div>
  );
}
export default AIHelpPanel;