import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams

  // If token is present, redirect to member edit page
  if (params.token) {
    redirect(`/mitglied?token=${params.token}`)
  }

  // Check if admin is logged in
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin_session")

  if (adminSession?.value === "authenticated") {
    redirect("/admin")
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="mb-8 text-center">
          <Image
            src="/images/image.png"
            alt="Reutberger Kloster-Biere Logo"
            width={180}
            height={180}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="mb-2 text-3xl font-bold text-primary">Klosterbrauerei Reutberg</h1>
          <p className="text-foreground">Mitglieder-Adressverwaltung</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
