"use client"

import { useState } from "react"
import { Check, Plus, Building2, CreditCard, Wallet } from "lucide-react"
import { useVelvet, formatCurrency } from "@/lib/velvet-store"
import { cn } from "@/lib/utils"

const sources = [
  { id: "s1", name: "Bank of America", detail: "Checking •• 4821", icon: Building2 },
  { id: "s2", name: "Visa Debit", detail: "•• 9032", icon: CreditCard },
  { id: "s3", name: "Apple Pay", detail: "Linked wallet", icon: Wallet },
]

const quickAmounts = [25, 50, 100, 250, 500, 1000]

export function AddScreen() {
  const { addMoney, balance } = useVelvet()
  const [amount, setAmount] = useState("0")
  const [source, setSource] = useState(sources[0])
  const [done, setDone] = useState(false)

  const numericAmount = Number.parseFloat(amount) || 0

  function press(key: string) {
    setAmount((prev) => {
      if (key === "del") {
        const next = prev.slice(0, -1)
        return next === "" ? "0" : next
      }
      if (key === ".") return prev.includes(".") ? prev : prev + "."
      if (prev === "0") return key
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev
      return prev + key
    })
  }

  function confirm() {
    if (numericAmount <= 0) return
    addMoney(numericAmount, source.name)
    setDone(true)
  }

  function reset() {
    setDone(false)
    setAmount("0")
  }

  if (done) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-10" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Money added</h2>
          <p className="mt-1 text-muted-foreground">
            <span className="font-semibold text-foreground">{formatCurrency(numericAmount)}</span> from {source.name}
          </p>
        </div>
        <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">New balance</p>
          <p className="text-2xl font-bold text-primary tabular-nums">{formatCurrency(balance)}</p>
        </div>
        <button
          onClick={reset}
          className="w-full max-w-xs rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Add more
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold">Add money</h1>
        <p className="text-sm text-muted-foreground">Top up your Velvet balance</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <p className="text-xs text-muted-foreground">Amount to add</p>
        <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums">
          <span className="align-top text-3xl">$</span>
          {amount}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {quickAmounts.map((q) => (
          <button
            key={q}
            onClick={() => setAmount(String(q))}
            className={cn(
              "rounded-xl border py-2.5 text-sm font-semibold transition-colors",
              numericAmount === q
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-foreground hover:bg-secondary",
            )}
          >
            ${q}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">From</p>
        <ul className="flex flex-col gap-2">
          {sources.map((s) => {
            const Icon = s.icon
            const active = source.id === s.id
            return (
              <li key={s.id}>
                <button
                  onClick={() => setSource(s)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {active && <Check className="size-3" strokeWidth={3} />}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="flex h-12 items-center justify-center rounded-2xl text-xl font-semibold text-foreground transition-colors hover:bg-secondary active:bg-muted"
          >
            {k === "del" ? "⌫" : k}
          </button>
        ))}
      </div>

      <button
        onClick={confirm}
        disabled={numericAmount <= 0}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
      >
        <Plus className="size-4" />
        Add {numericAmount > 0 ? formatCurrency(numericAmount) : "money"}
      </button>
    </div>
  )
}
