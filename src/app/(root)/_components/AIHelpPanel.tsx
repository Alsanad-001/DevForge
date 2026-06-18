"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, X, Sparkles, AlertTriangle } from "lucide-react";

const ACTIONS = [
  { id: "explain", label: "Explain Code", color: "from-blue-500 to-blue-600" },
  { id: "debug", label: "Debug & Fix", color: "from-red-500 to-red-600" },
  { id: "optimize", label: "Optimize", color: "from-green-500 to-green-600" },
];

function getTimeUntilResetPT() {
  const now = new Date();
  const reset = new Date();
  reset.setUTCHours(8, 0, 0, 0);
  if (now >= reset) reset.setUTCDate(reset.getUTCDate() + 1);
  const diff = reset.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function AIHelpPanel({ onClose }: { onClose: () => void }) {
  const { language, getCode } = useCodeEditorStore();
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null); // NEW: Dedicated error state
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [timeLeft, setTimeLeft] = useState(getTimeUntilResetPT());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeUntilResetPT()), 60000);
    return () => clearInterval(interval);
  }, []);

  // ONLY check the error string for keywords, not the successful result
  const errorMessage = error?.toLowerCase() || "";

  const isQuotaError =
    errorMessage.includes("quota") ||
    errorMessage.includes("rate") ||
    errorMessage.includes("exhausted");

  const isModelError =
    errorMessage.includes("not found") ||
    errorMessage.includes("404") ||
    errorMessage.includes("model");

  const isServiceError =
    errorMessage.includes("unavailable") ||
    errorMessage.includes("503");

  const handleAction = async (action: string) => {
    const code = getCode();
    if (!code) return;

    setIsLoading(true);
    setActiveAction(action);
    setResult("");
    setError(null); // Clear previous errors

    try {
      const response = await fetch("/api/ai-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, action }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
        setError(null);
      } else {
        setResult("");
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setResult("");
      setError("Failed to get AI response. Please try again.");
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
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${action.color} opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && activeAction === action.id ? (
              <Loader2 className="size-3 animate-spin mx-auto" />
            ) : (
              action.label
            )}
          </motion.button>
        ))}
      </div>

      {/* Result Area */}
      {error ? (
        <div className="bg-[#12121a] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="size-4 text-yellow-400" />
            <p className="text-xs text-yellow-400 font-medium">
              {isQuotaError
                ? "AI quota limit reached"
                : isModelError
                  ? "AI model unavailable"
                  : isServiceError
                    ? "AI service temporarily unavailable"
                    : "AI request failed"}
            </p>
          </div>
          <p className="text-xs text-gray-500 mb-2">{error}</p>
          {isQuotaError && (
             <p className="text-xs text-gray-500">Resets in: <span className="text-white font-medium">{timeLeft}</span></p>
          )}
        </div>
      ) : result ? (
        <div className="bg-[#12121a] rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
          {result}
        </div>
      ) : !isLoading ? (
        <p className="text-xs text-gray-500 text-center">
          Select an action to get AI assistance for your code
        </p>
      ) : null}
    </motion.div>
  );
}

export default AIHelpPanel;