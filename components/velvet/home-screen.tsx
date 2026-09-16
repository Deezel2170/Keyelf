"use client"

import { useState } from "react"
import { ArrowUpRight, Plus, Eye, EyeOff, Bell, TrendingUp, CreditCard } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useVelvet, formatCurrency, formatRelative } from "@/lib/velvet-store"
import { cn } from "@/lib/utils"
import type { Screen } from "./app-shell"

export function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { balance, transactions, contacts } = useVelvet()
  const [hidden, setHidden] = useState(false)

  const recent = transactions.slice(0, 4)
  const incoming = transactions.filter((t) => t.type !== "sent").reduce((a, t) => a + t.amount, 0)
  const outgoing = transactions.filter((t) => t.type === "sent").reduce((a, t) => a + t.amount, 0)

  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-border">
            <AvatarFallback className="bg-secondary text-sm font-semibold text-foreground">JR</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="text-sm font-semibold">Jordan Rivera</p>
          </div>
        </div>
        <button
          className="relative flex size-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
        </button>
      </header>

      {/* Balance card */}
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-16 -left-6 size-44 rounded-full bg-primary-foreground/10" />
        <div className="relative flex items-center justify-between">
          <p className="text-sm font-medium opacity-80">Total balance</p>
          <button
            onClick={() => setHidden((h) => !h)}
            className="flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium"
            aria-label={hidden ? "Show balance" : "Hide balance"}
          >
            {hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {hidden ? "Show" : "Hide"}
          </button>
        </div>
        <p className="relative mt-2 text-4xl font-bold tracking-tight tabular-nums">
          {hidden ? "••••••" : formatCurrency(balance)}
        </p>
        <div className="relative mt-4 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2 py-0.5 font-medium">
            <TrendingUp className="size-3.5" />
            +2.4%
          </span>
          <span className="opacity-80">this month</span>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate("send")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary-foreground/15 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-primary-foreground/25"
          >
            <ArrowUpRight className="size-4" />
            Send
          </button>
          <button
            onClick={() => onNavigate("add")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary-foreground py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Add money
          </button>
        </div>
      </section>

      {/* Money in / out */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
            <ArrowUpRight className="size-4 rotate-180" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Money in</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(incoming)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
            <ArrowUpRight className="size-4" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Money out</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(outgoing)}</p>
        </div>
      </section>

      {/* Quick send contacts */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Quick send</h2>
          <button onClick={() => onNavigate("send")} className="text-xs font-medium text-primary">
            See all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => onNavigate("send")}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <span
                className="flex size-14 items-center justify-center rounded-full text-base font-semibold text-primary-foreground"
                style={{ backgroundColor: c.color }}
              >
                {c.initials}
              </span>
              <span className="max-w-14 truncate text-xs text-muted-foreground">{c.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <button onClick={() => onNavigate("activity")} className="text-xs font-medium text-primary">
            View all
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {recent.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl px-1 py-2.5">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full",
                  t.type === "sent" ? "bg-secondary text-foreground" : "bg-primary/15 text-primary",
                )}
              >
                {t.type === "added" ? (
                  <CreditCard className="size-5" />
                ) : (
                  <ArrowUpRight className={cn("size-5", t.type !== "sent" && "rotate-180")} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">{formatRelative(t.date)}</p>
              </div>
              <p
                className={cn(
                  "shrink-0 text-sm font-semibold tabular-nums",
                  t.type === "sent" ? "text-foreground" : "text-primary",
                )}
              >
                {t.type === "sent" ? "-" : "+"}
                {formatCurrency(t.amount)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
