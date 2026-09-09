"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Trash2, ShieldCheck } from "lucide-react";

interface ProfileAvatarSectionProps {
  name: string;
  homePort: string;
  fisherId: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

export function ProfileAvatarSection({
  name,
  homePort,
  fisherId,
  avatarUrl,
  onAvatarChange,
}: ProfileAvatarSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setUploadError("Please choose an image under 500 KB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      onAvatarChange(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError("Could not read that image. Try another one.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((w: string) => w.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6 font-intert">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-brand/10 border-2 border-border overflow-hidden flex items-center justify-center text-brand font-medium text-xl shadow-xs">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={80}
                  height={80}
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(name || "Fisher")}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload profile image"
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-surface border border-border text-primary hover:bg-surface-muted flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              {isUploading ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              ) : (
                <Camera size={13} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-primary">
                {name || "Fisher"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                <ShieldCheck size={11} />
                <span>RegisteredFisher</span>
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">{homePort}</p>
            <p className="text-[11px] text-muted font-mono mt-1">
              ID: {fisherId}
            </p>
            {uploadError && (
              <p className="text-[11px] text-danger mt-1">{uploadError}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-xl border border-border bg-bg hover:bg-surface-muted text-xs font-medium text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Change Photo"}
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => onAvatarChange(null)}
              className="px-3 py-1.5 rounded-xl border border-border bg-bg hover:bg-red-500/10 hover:border-red-500/30 text-xs font-medium text-red-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={12} />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
