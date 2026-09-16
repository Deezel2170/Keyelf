"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type TxType = "sent" | "received" | "added"

export type Transaction = {
  id: string
  type: TxType
  name: string
  handle: string
  amount: number
  note?: string
  date: string // ISO
  category: string
}

export type Contact = {
  id: string
  name: string
  handle: string
  initials: string
  color: string
}

type VelvetState = {
  balance: number
  transactions: Transaction[]
  contacts: Contact[]
  sendMoney: (args: { contact: Contact; amount: number; note?: string }) => void
  addMoney: (amount: number, source: string) => void
}

const VelvetContext = createContext<VelvetState | null>(null)

const initialContacts: Contact[] = [
  { id: "c1", name: "Maya Chen", handle: "@mayac", initials: "MC", color: "oklch(0.78 0.19 150)" },
  { id: "c2", name: "Devon Park", handle: "@dpark", initials: "DP", color: "oklch(0.7 0.15 220)" },
  { id: "c3", name: "Aria Lopez", handle: "@arial", initials: "AL", color: "oklch(0.75 0.16 60)" },
  { id: "c4", name: "Sam Okafor", handle: "@samok", initials: "SO", color: "oklch(0.68 0.18 320)" },
  { id: "c5", name: "Lena Voss", handle: "@lenav", initials: "LV", color: "oklch(0.72 0.17 25)" },
]

const initialTransactions: Transaction[] = [
  {
    id: "t1",
    type: "received",
    name: "Maya Chen",
    handle: "@mayac",
    amount: 240,
    note: "Concert tickets",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    category: "Friends",
  },
  {
    id: "t2",
    type: "sent",
    name: "Blue Bottle Coffee",
    handle: "@bluebottle",
    amount: 8.5,
    note: "Morning cold brew",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    category: "Food & Drink",
  },
  {
    id: "t3",
    type: "added",
    name: "Bank of America",
    handle: "Visa •• 4821",
    amount: 500,
    note: "Top up",
    date: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    category: "Top up",
  },
  {
    id: "t4",
    type: "sent",
    name: "Devon Park",
    handle: "@dpark",
    amount: 62,
    note: "Dinner split",
    date: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString(),
    category: "Friends",
  },
  {
    id: "t5",
    type: "sent",
    name: "Lumen Energy",
    handle: "@lumen",
    amount: 118.4,
    note: "Electric bill",
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    category: "Bills",
  },
  {
    id: "t6",
    type: "received",
    name: "Aria Lopez",
    handle: "@arial",
    amount: 35,
    note: "Thanks!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
    category: "Friends",
  },
]

export function VelvetProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(4820.75)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [contacts] = useState<Contact[]>(initialContacts)

  const sendMoney = useCallback(({ contact, amount, note }: { contact: Contact; amount: number; note?: string }) => {
    setBalance((b) => Math.max(0, b - amount))
    setTransactions((prev) => [
      {
        id: `t${Date.now()}`,
        type: "sent",
        name: contact.name,
        handle: contact.handle,
        amount,
        note: note || undefined,
        date: new Date().toISOString(),
        category: "Friends",
      },
      ...prev,
    ])
  }, [])

  const addMoney = useCallback((amount: number, source: string) => {
    setBalance((b) => b + amount)
    setTransactions((prev) => [
      {
        id: `t${Date.now()}`,
        type: "added",
        name: source,
        handle: "Top up",
        amount,
        note: "Added to balance",
        date: new Date().toISOString(),
        category: "Top up",
      },
      ...prev,
    ])
  }, [])

  return (
    <VelvetContext.Provider value={{ balance, transactions, contacts, sendMoney, addMoney }}>
      {children}
    </VelvetContext.Provider>
  )
}

export function useVelvet() {
  const ctx = useContext(VelvetContext)
  if (!ctx) throw new Error("useVelvet must be used within VelvetProvider")
  return ctx
}

export function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
