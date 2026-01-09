import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin_session")

  if (adminSession?.value !== "authenticated") {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-white">
      <AdminDashboard />
    </main>
  )
}
