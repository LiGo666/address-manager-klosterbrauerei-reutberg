import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-white">
      <AdminDashboard />
    </main>
  )
}
