"use client"

import { Home, ArrowUpRight, Plus, Receipt, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Screen } from "./app-shell"

const items: { key: Screen; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "send", label: "Send", icon: ArrowUpRight },
  { key: "add", label: "Add", icon: Plus },
  { key: "activity", label: "Activity", icon: Receipt },
  { key: "card", label: "Card", icon: CreditCard },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Screen
  onChange: (s: Screen) => void
}) {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-20 border-t border-border bg-card/80 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between gap-1 py-2">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          const isAction = key === "add"
          if (isAction) {
            return (
              <li key={key} className="flex-1">
                <button
                  onClick={() => onChange(key)}
                  className="mx-auto flex size-12 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
                  aria-label="Add money"
                >
                  <Icon className="size-6" strokeWidth={2.5} />
                </button>
              </li>
            )
          }
          return (
            <li key={key} className="flex-1">
              <button
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
