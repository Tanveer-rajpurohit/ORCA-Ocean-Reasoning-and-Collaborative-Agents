"use client";

import React, { useState } from "react";
import { Copy, Check, Volume2, Square, Loader2 } from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AgentThinking } from "./AgentThinking";
import { MarineChartCard } from "./MarineChartCard";
import { CitationSources } from "./CitationSources";
import { useSpeechPlayback } from "../../../../hooks";
import type { ChatMessageData } from "../../../../types";

interface ChatMessageItemProps {
  message: ChatMessageData;
  isStreaming?: boolean;
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    return extractText(
      (node as { props?: { children?: React.ReactNode } }).props?.children,
    );
  }
  return "";
}

export function ChatMessageItem({
  message,
  isStreaming = false,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const { speak, stop, status, activeId } = useSpeechPlayback();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isThisLoading = activeId === message.id && status === "loading";
  const isThisSpeaking = activeId === message.id && status === "speaking";

  if (message.role === "user") {
    return (
      <div className="flex justify-end my-4 font-intert animate-in fade-in slide-in-from-bottom-1 duration-200 motion-reduce:animate-none">
        <div className="max-w-[85%] rounded-2xl bg-surface border border-border px-4 py-2.5 text-sm text-primary leading-relaxed shadow-xs">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6 font-intert animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <ThinkingOrb
            state={isStreaming ? "working" : "composing"}
            size={20}
            theme="light"
          />
        </div>
        <span className="text-sm font-semibold text-primary font-intert">
          ORCA
        </span>
      </div>

      {message.thinking && (
        <AgentThinking
          durationSeconds={message.thinking.durationSeconds}
          thoughtSummary={message.thinking.summary}
          steps={message.thinking.steps}
          detailedThought={message.thinking.detailedThought}
          isThinking={isStreaming}
        />
      )}

      <div className="pl-0 sm:pl-1">
        {message.content && (
          <div className="max-w-none text-[14px] text-secondary leading-[1.75] font-intert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl sm:text-2xl font-bold font-instrument text-primary mt-6 mb-3 tracking-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg sm:text-xl font-semibold text-primary mt-5 mb-2.5 tracking-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold text-primary mt-4 mb-2 tracking-tight">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-sm font-semibold text-primary mt-3 mb-1.5 tracking-tight">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-secondary leading-[1.75] my-2 [&:first-child]:mt-0">
                    {children}
                  </p>
                ),
                table: ({ children }) => (
                  <div className="w-full max-w-full my-3.5 overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
                    <table className="w-full text-left text-xs sm:text-[13px] border-collapse min-w-[420px]">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-surface-muted/50 border-b border-border font-intert">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-border/50 font-intert text-secondary">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-surface-muted/25 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-3.5 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3.5 py-2.5 text-secondary first:text-primary first:font-medium leading-relaxed">
                    {children}
                  </td>
                ),
                strong: ({ children }) => {
                  const rawText = extractText(children).trim();
                  const isVerdict =
                    /^(Safe to go out|Caution|Severe danger|Do not go)$/i.test(
                      rawText,
                    );
                  if (isVerdict) {
                    const tone = /safe/i.test(rawText)
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : /caution/i.test(rawText)
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                    return (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border ${tone}`}
                      >
                        {rawText}
                      </span>
                    );
                  }
                  return (
                    <strong className="font-semibold text-primary">
                      {children}
                    </strong>
                  );
                },
                em: ({ children }) => (
                  <em className="italic text-secondary/90">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 my-3 space-y-3 text-secondary marker:text-primary">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 my-3 space-y-3 text-secondary marker:text-primary">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-[1.7] pl-1 my-1">{children}</li>
                ),
                pre: ({ children }) => (
                  <div className="relative my-4 overflow-hidden rounded-xl border border-border bg-surface-muted/30">
                    <div className="overflow-x-auto p-3.5">
                      <pre className="font-mono text-xs text-secondary leading-relaxed whitespace-pre">
                        {children}
                      </pre>
                    </div>
                  </div>
                ),
                code: ({ children, className }) => {
                  const isMultiLine =
                    typeof children === "string" && children.includes("\n");
                  const isBlock =
                    Boolean(className?.startsWith("language-")) || isMultiLine;
                  if (isBlock) {
                    return (
                      <code className="font-mono text-xs text-secondary leading-relaxed">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="font-mono text-xs bg-surface-muted px-1.5 py-0.5 rounded-md border border-border text-brand font-medium">
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="my-3 pl-3.5 border-l-2 border-brand/40 text-secondary/90 italic">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-brand font-medium"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="border-border/50 my-4" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-brand align-middle rounded-xs animate-pulse" />
            )}
          </div>
        )}

        {message.chart && <MarineChartCard data={message.chart} />}

        {message.citations && <CitationSources citations={message.citations} />}

        {message.content && !isStreaming && (
          <div className="flex items-center gap-2 pt-2 mt-1">
            <button
              type="button"
              onClick={() => {
                if (isThisSpeaking || isThisLoading) {
                  stop();
                } else {
                  speak(message.content, message.id);
                }
              }}
              title={
                isThisLoading
                  ? "Generating voice..."
                  : isThisSpeaking
                    ? "Stop playback"
                    : "Read this answer aloud"
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                isThisSpeaking
                  ? "bg-brand/10 text-brand border border-brand/25 font-medium"
                  : isThisLoading
                    ? "bg-surface-muted text-brand border border-border font-medium"
                    : "text-muted hover:text-primary hover:bg-surface-muted border border-transparent"
              }`}
            >
              {isThisLoading ? (
                <>
                  <Loader2 size={13} className="animate-spin text-brand" />
                  <span>Loading...</span>
                </>
              ) : isThisSpeaking ? (
                <>
                  <Square size={11} className="fill-current text-brand" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={13} />
                  <span>Listen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              title="Copy response"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
            >
              {copied ? (
                <Check size={13} className="text-ocean" />
              ) : (
                <Copy size={13} />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
