"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Delete, Search } from "lucide-react"
import { useVelvet, formatCurrency, type Contact } from "@/lib/velvet-store"
import { cn } from "@/lib/utils"

type Step = "contact" | "amount" | "done"

export function SendScreen() {
  const { contacts, balance, sendMoney } = useVelvet()
  const [step, setStep] = useState<Step>("contact")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Contact | null>(null)
  const [amount, setAmount] = useState("0")
  const [note, setNote] = useState("")

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.handle.toLowerCase().includes(query.toLowerCase()),
  )

  const numericAmount = Number.parseFloat(amount) || 0
  const overBalance = numericAmount > balance

  function press(key: string) {
    setAmount((prev) => {
      if (key === "del") {
        const next = prev.slice(0, -1)
        return next === "" ? "0" : next
      }
      if (key === ".") {
        if (prev.includes(".")) return prev
        return prev + "."
      }
      if (prev === "0") return key
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev
      return prev + key
    })
  }

  function confirm() {
    if (!selected || numericAmount <= 0 || overBalance) return
    sendMoney({ contact: selected, amount: numericAmount, note })
    setStep("done")
  }

  function reset() {
    setStep("contact")
    setSelected(null)
    setAmount("0")
    setNote("")
    setQuery("")
  }

  if (step === "done" && selected) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-10" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Money sent</h2>
          <p className="mt-1 text-muted-foreground">
            You sent <span className="font-semibold text-foreground">{formatCurrency(numericAmount)}</span> to{" "}
            {selected.name}
          </p>
        </div>
        <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-4 text-left">
          <Row label="To" value={selected.name} />
          <Row label="Handle" value={selected.handle} />
          {note && <Row label="Note" value={note} />}
          <Row label="New balance" value={formatCurrency(balance)} highlight />
        </div>
        <button
          onClick={reset}
          className="w-full max-w-xs rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Done
        </button>
      </div>
    )
  }

  if (step === "amount" && selected) {
    return (
      <div className="flex min-h-[78vh] flex-col px-5 pb-4 pt-4">
        <div className="flex flex-col items-center gap-2">
          <span
            className="flex size-14 items-center justify-center rounded-full text-base font-semibold text-primary-foreground"
            style={{ backgroundColor: selected.color }}
          >
            {selected.initials}
          </span>
          <p className="text-sm font-medium">{selected.name}</p>
          <p className="text-xs text-muted-foreground">{selected.handle}</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <p className={cn("text-5xl font-bold tracking-tight tabular-nums", overBalance && "text-destructive")}>
            <span className="text-3xl align-top">$</span>
            {amount}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {overBalance ? "Amount exceeds balance" : `${formatCurrency(balance)} available`}
          </p>
        </div>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
          maxLength={40}
          className="mb-4 w-full rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />

        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="flex h-14 items-center justify-center rounded-2xl text-xl font-semibold text-foreground transition-colors hover:bg-secondary active:bg-muted"
            >
              {k === "del" ? <Delete className="size-5" /> : k}
            </button>
          ))}
        </div>

        <button
          onClick={confirm}
          disabled={numericAmount <= 0 || overBalance}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <ArrowUpRight className="size-4" />
          Send {numericAmount > 0 ? formatCurrency(numericAmount) : "money"}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold">Send money</h1>
        <p className="text-sm text-muted-foreground">Choose who you want to pay</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or @handle"
          className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <ul className="flex flex-col gap-1">
        {filtered.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => {
                setSelected(c)
                setStep("amount")
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-secondary"
            >
              <span
                className="flex size-11 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
                style={{ backgroundColor: c.color }}
              >
                {c.initials}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.handle}</p>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground" />
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-sm text-muted-foreground">No contacts found</li>
        )}
      </ul>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", highlight && "text-primary")}>{value}</span>
    </div>
  )
}
