"use client"

import { useState } from "react"
import { Eye, EyeOff, Snowflake, Settings2, Wifi, Lock, ShoppingBag, Globe } from "lucide-react"
import { useVelvet, formatCurrency } from "@/lib/velvet-store"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

export function CardScreen() {
  const { balance } = useVelvet()
  const [revealed, setRevealed] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [online, setOnline] = useState(true)
  const [intl, setIntl] = useState(false)

  const number = "4821 7390 5512 0098"
  const masked = "•••• •••• •••• 0098"

  return (
    <div className="flex flex-col gap-6 px-5 pb-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold">My card</h1>
        <p className="text-sm text-muted-foreground">Velvet virtual debit</p>
      </div>

      {/* Card visual */}
      <div
        className={cn(
          "relative aspect-[1.586/1] w-full overflow-hidden rounded-3xl p-6 text-primary-foreground transition-all duration-500",
          frozen ? "bg-secondary text-foreground" : "bg-primary",
        )}
      >
        <div className="absolute -right-12 -top-12 size-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-10 size-44 rounded-full bg-white/10" />

        <div className="relative flex items-start justify-between">
          <span className="text-lg font-bold tracking-tight">Velvet</span>
          <Wifi className="size-6 rotate-90 opacity-80" />
        </div>

        <div className="relative mt-8">
          <div className="h-9 w-12 rounded-md bg-white/30" />
        </div>

        <p className="relative mt-4 font-mono text-lg tracking-[0.15em] tabular-nums">
          {revealed && !frozen ? number : masked}
        </p>

        <div className="relative mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase opacity-70">Card holder</p>
            <p className="text-sm font-medium">Jordan Rivera</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-70">Expires</p>
            <p className="text-sm font-medium">09/29</p>
          </div>
          <p className="text-sm font-semibold italic">VISA</p>
        </div>

        {frozen && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-card/60 backdrop-blur-sm">
            <Snowflake className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Card frozen</span>
          </div>
        )}
      </div>

      {/* Balance + reveal */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Available to spend</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(balance)}</p>
        </div>
        <button
          onClick={() => setRevealed((r) => !r)}
          disabled={frozen}
          className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground disabled:opacity-40"
        >
          {revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {revealed ? "Hide details" : "Show details"}
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setFrozen((f) => !f)}
          className={cn(
            "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors",
            frozen ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary",
          )}
        >
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              frozen ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
            )}
          >
            <Snowflake className="size-4" />
          </span>
          <span className="text-sm font-semibold">{frozen ? "Unfreeze" : "Freeze card"}</span>
          <span className="text-xs text-muted-foreground">Instantly block payments</span>
        </button>
        <button className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary">
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
            <Settings2 className="size-4" />
          </span>
          <span className="text-sm font-semibold">Card settings</span>
          <span className="text-xs text-muted-foreground">Limits & PIN</span>
        </button>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border bg-card">
        <ControlRow
          icon={ShoppingBag}
          title="Online payments"
          subtitle="Allow e-commerce purchases"
          checked={online}
          onChange={setOnline}
          disabled={frozen}
        />
        <div className="mx-4 border-t border-border" />
        <ControlRow
          icon={Globe}
          title="International"
          subtitle="Allow payments abroad"
          checked={intl}
          onChange={setIntl}
          disabled={frozen}
        />
        <div className="mx-4 border-t border-border" />
        <ControlRow
          icon={Lock}
          title="Contactless"
          subtitle="Tap to pay enabled"
          checked={!frozen}
          onChange={() => setFrozen((f) => !f)}
        />
      </div>
    </div>
  )
}

function ControlRow({
  icon: Icon,
  title,
  subtitle,
  checked,
  onChange,
  disabled,
}: {
  icon: typeof ShoppingBag
  title: string
  subtitle: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
        <Icon className="size-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}
