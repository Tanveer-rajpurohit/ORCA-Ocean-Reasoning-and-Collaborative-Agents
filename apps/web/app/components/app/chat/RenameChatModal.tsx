"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface RenameChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
  currentTitle: string;
}

export function RenameChatModal({
  isOpen,
  onClose,
  onConfirm,
  currentTitle,
}: RenameChatModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const [prevTitle, setPrevTitle] = useState(currentTitle);

  if (currentTitle !== prevTitle) {
    setPrevTitle(currentTitle);
    setTitle(currentTitle);
  }

  if (!isOpen || typeof document === "undefined") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onConfirm(title.trim());
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 font-intert shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-instrument text-primary tracking-tight">
            Rename Chat
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
        <p className="text-xs text-muted mb-4 font-intert">
          Change the title of this conversation to find it later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1.5 font-medium font-intert">
              Conversation Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Tomorrow's sea conditions"
              autoFocus
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-bg text-primary placeholder:text-muted focus:outline-none focus:border-brand/50 font-intert transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface text-secondary hover:text-primary text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || title.trim() === currentTitle}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                title.trim() && title.trim() !== currentTitle
                  ? "btn-brand-solid cursor-pointer shadow-xs"
                  : "bg-surface-muted text-muted border border-border cursor-not-allowed opacity-80"
              }`}
            >
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
