"use client";

import { useTambo, useTamboThreadInput, ComponentRenderer } from "@tambo-ai/react";
import { Send, Loader2, Sparkles } from "lucide-react";

export function FormAssistant() {
  const { messages, isStreaming } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    await submit();
  };

  return (
    <div className="flex flex-col h-full bg-black/20">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-zinc-500 text-sm max-w-[240px]">
              "Hey! Ask me to change the title, add a field, or reorder them."
            </p>
          </div>
        ) : (
          messages
            .filter(m => m.content.some(b => (b.type === "text" && b.text?.trim()) || b.type === "component"))
            .map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-zinc-300 border border-white/10"
                }`}
              >
                {/* Text Content */}
                {message.content.map((block, i) => {
                  if (block.type === "text") return <p key={i}>{block.text}</p>;
                  
                  // Component Content (If the AI generates a small UI piece)
                  if (block.type === "component") {
                    return (
                      <div key={i} className="mt-4">
                         <ComponentRenderer {...({ content: block, messageId: message.id } as any)} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))
        )}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl"
      >
        <div className="relative flex items-end gap-2">
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              // Auto-adjust height
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            placeholder="E.g. 'Add a phone number field after email'"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 resize-none min-h-[46px] max-h-[150px]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!value.trim() || isPending}
            className="absolute right-2 bottom-2 p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white rounded-lg transition-colors ring-offset-2 focus:ring-2 focus:ring-indigo-500"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
