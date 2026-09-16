"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, CreditCard, Search } from "lucide-react"
import { useVelvet, formatCurrency, formatRelative, type Transaction } from "@/lib/velvet-store"
import { cn } from "@/lib/utils"

type Filter = "all" | "sent" | "received" | "added"

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sent", label: "Sent" },
  { key: "received", label: "Received" },
  { key: "added", label: "Added" },
]

export function ActivityScreen() {
  const { transactions } = useVelvet()
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")

  const list = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter = filter === "all" || t.type === filter
      const matchesQuery =
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        (t.note ?? "").toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [transactions, filter, query])

  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}
    for (const t of list) {
      const key = new Date(t.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
      groups[key] = groups[key] || []
      groups[key].push(t)
    }
    return groups
  }, [list])

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="text-sm text-muted-foreground">All your transactions</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transactions"
          className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No transactions found</p>
      ) : (
        <div className="flex flex-col gap-5">
          {Object.entries(grouped).map(([day, items]) => (
            <section key={day}>
              <h2 className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{day}</h2>
              <ul className="flex flex-col">
                {items.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 rounded-2xl px-1 py-3 transition-colors hover:bg-secondary"
                  >
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
                      <p className="truncate text-xs text-muted-foreground">
                        {t.note ? `${t.note} · ` : ""}
                        {formatRelative(t.date)}
                      </p>
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
          ))}
        </div>
      )}
    </div>
  )
}
