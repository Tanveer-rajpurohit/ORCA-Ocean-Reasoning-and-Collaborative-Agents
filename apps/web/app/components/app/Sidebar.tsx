"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Bot,
  Map,
  Compass,
  CloudLightning,
  CloudSun,
  FileClock,
  SlidersHorizontal,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { AgentOrb } from "../AgentOrb";
import { ChatSessionItem } from "./chat";
import { useAuth } from "../../../context/AuthContext";
import { useLocalStorageState } from "../../../hooks";
import { useChatStore } from "../../../stores";
import { ThemeSwitcher } from "../../../components/ui/ThemeSwitcher";
import type { ProfileData, ChatSessionSummary } from "../../../types";
import { DEFAULT_PROFILE } from "../../../types";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Bot;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/chat", label: "Chat", icon: Bot },
  { href: "/map", label: "Sea Map", icon: Map },
  { href: "/advisories", label: "Advisories", icon: Compass },
  { href: "/hazards", label: "Hazards", icon: CloudLightning },
  { href: "/report", label: "Report", icon: CloudSun },
  { href: "/audit-log", label: "Audit Log", icon: FileClock },
  { href: "/settings", label: "Settings", icon: SlidersHorizontal },
];

interface SidebarProps {
  children?: React.ReactNode;
}

function groupByDate(
  items: ChatSessionSummary[],
): Record<string, ChatSessionSummary[]> {
  const grouped: Record<string, ChatSessionSummary[]> = {};
  for (const item of items) {
    const diffDays = Math.floor(
      (Date.now() - new Date(item.last_active_at).getTime()) / 86400000,
    );
    const key =
      diffDays <= 0
        ? "Today"
        : diffDays === 1
          ? "Yesterday"
          : diffDays <= 7
            ? "Previous 7 Days"
            : "Earlier";
    if (!grouped[key]) grouped[key] = [];
    grouped[key]!.push(item);
  }
  return grouped;
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const [profile] = useLocalStorageState<ProfileData>(
    "orca_profile",
    DEFAULT_PROFILE,
  );
  const sessions = useChatStore((state) => state.sessions);
  const currentSessionId = useChatStore((state) => state.currentSessionId);

  const groupedSessions = groupByDate(sessions);

  const displayName = profile.full_name || user?.full_name || "Fisher";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n.charAt(0))
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close mobile menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border md:relative md:z-auto transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] w-64 md:translate-x-0 ${
          collapsed ? "md:w-17" : "md:w-60"
        } ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="flex items-center h-14 shrink-0 px-3.5 justify-between border-b border-border">
          <Link
            href="/chat"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 text-primary font-instrument italic text-xl tracking-tight ${
              collapsed ? "md:hidden" : ""
            }`}
          >
            <AgentOrb size={18} className="not-italic text-brand shrink-0" />
            <span>ORCA</span>
          </Link>

          <button
            type="button"
            aria-label="Expand sidebar"
            onClick={() => setCollapsed(false)}
            className={`group/orb relative hidden items-center justify-center w-9 h-9 rounded-xl text-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer ${
              collapsed ? "md:flex md:mx-auto" : "md:hidden"
            }`}
          >
            <AgentOrb
              size={20}
              className="text-brand absolute transition-all duration-200 group-hover/orb:opacity-0 group-hover/orb:scale-75"
            />
            <PanelLeftOpen
              size={16}
              className="absolute transition-all duration-200 opacity-0 scale-75 group-hover/orb:opacity-100 group-hover/orb:scale-100"
            />
          </button>

          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed(true)}
            className={`hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer ${
              collapsed ? "md:hidden" : ""
            }`}
          >
            <PanelLeftClose size={16} />
          </button>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-2.5">
          <Link
            href="/chat"
            onClick={() => {
              setMobileOpen(false);
              window.dispatchEvent(new CustomEvent("orca:new-chat"));
            }}
            className={`flex items-center btn-brand-solid rounded-xl text-sm font-medium font-intert transition-all duration-300 ${
              collapsed
                ? "w-full px-3 py-2.5 gap-2 md:w-10 md:h-10 md:justify-center md:mx-auto"
                : "w-full px-3 py-2.5 gap-2"
            }`}
          >
            <Plus size={16} strokeWidth={2.5} className="shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                collapsed
                  ? "w-auto opacity-100 md:w-0 md:opacity-0 md:hidden"
                  : "w-auto opacity-100"
              }`}
            >
              New Chat
            </span>
          </Link>
        </div>

        <nav className="px-2.5 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/chat" && pathname.startsWith("/chat"));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-[13px] font-medium font-intert transition-all duration-200 ${
                  collapsed
                    ? "w-full px-3 py-2 gap-2.5 md:w-10 md:h-10 md:justify-center md:mx-auto"
                    : "w-full px-3 py-2 gap-2.5"
                } ${
                  isActive
                    ? "bg-surface-muted text-primary font-semibold"
                    : "text-secondary hover:text-primary hover:bg-surface-muted"
                }`}
              >
                <item.icon size={16} strokeWidth={1.8} className="shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    collapsed
                      ? "w-auto opacity-100 md:w-0 md:opacity-0 md:hidden"
                      : "w-auto opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`flex-1 px-2.5 overflow-y-auto hide-scrollbar transition-all duration-300 ${
            collapsed
              ? "md:opacity-0 md:pointer-events-none md:max-h-0 opacity-100 mt-3"
              : "opacity-100 mt-3"
          }`}
        >
          {Object.entries(groupedSessions).map(([date, items]) => (
            <div key={date} className="mb-3">
              <p className="px-2.5 mb-1 text-[11px] font-medium font-intert text-muted">
                {date}
              </p>
              {items.map((item) => (
                <ChatSessionItem
                  key={item.session_id}
                  item={item}
                  isActive={
                    pathname === `/chat/${item.session_id}` ||
                    (pathname === "/chat" &&
                      currentSessionId === item.session_id)
                  }
                  onCloseMobile={() => setMobileOpen(false)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="p-2.5 border-t border-border mt-auto shrink-0">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-muted transition-all duration-300 ${
              collapsed ? "md:justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-medium font-intert text-xs shrink-0 overflow-hidden">
              <span>{initials}</span>
            </div>
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                collapsed
                  ? "w-auto opacity-100 flex-1 min-w-0 md:w-0 md:opacity-0 md:hidden"
                  : "w-auto opacity-100 flex-1 min-w-0"
              }`}
            >
              <p className="text-xs font-medium font-intert text-primary truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-muted font-intert truncate">
                {displayEmail}
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-border bg-surface">
          <button
            type="button"
            aria-label="Open sidebar"
            onClick={() => setMobileOpen(true)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-surface-muted transition-colors"
          >
            <Menu size={18} />
          </button>
          <Link
            href="/chat"
            className="flex items-center gap-1.5 text-primary font-instrument italic text-lg tracking-tight"
          >
            <AgentOrb size={16} className="not-italic text-brand" />
            <span className="hidden sm:inline">ORCA</span>
          </Link>
          <ThemeSwitcher />
        </header>

        <main className="flex-1 overflow-hidden flex flex-col min-h-0 bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
