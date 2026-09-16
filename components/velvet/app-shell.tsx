"use client"

import { useState } from "react"
import { BottomNav } from "./bottom-nav"
import { HomeScreen } from "./home-screen"
import { SendScreen } from "./send-screen"
import { AddScreen } from "./add-screen"
import { ActivityScreen } from "./activity-screen"
import { CardScreen } from "./card-screen"

export type Screen = "home" | "send" | "add" | "activity" | "card"

export function AppShell() {
  const [screen, setScreen] = useState<Screen>("home")

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <main className="flex-1">
        {screen === "home" && <HomeScreen onNavigate={setScreen} />}
        {screen === "send" && <SendScreen />}
        {screen === "add" && <AddScreen />}
        {screen === "activity" && <ActivityScreen />}
        {screen === "card" && <CardScreen />}
      </main>
      <BottomNav active={screen} onChange={setScreen} />
    </div>
  )
}
