import { VelvetProvider } from "@/lib/velvet-store"
import { AppShell } from "@/components/velvet/app-shell"

export default function Page() {
  return (
    <VelvetProvider>
      <AppShell />
    </VelvetProvider>
  )
}
