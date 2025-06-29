import { Navbar } from "@/components/navbar"
import { SettingsContent } from "@/components/settings-content"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <SettingsContent />
      </main>
    </div>
  )
}
