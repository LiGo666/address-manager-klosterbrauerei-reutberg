import { createClient } from "@/lib/supabase/server"
import { MemberEditForm } from "@/components/member-edit-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"
import { isValidTokenFormat } from "@/lib/token"
import Image from "next/image"
import Link from "next/link"

interface MitgliedPageProps {
  searchParams: Promise<{ token?: string }>
}

const Logo = () => (
  <div className="mb-6 text-center">
    <Image
      src="/images/image.png"
      alt="Reutberger Kloster-Biere Logo"
      width={100}
      height={100}
      className="mx-auto mb-2"
      priority
    />
    <h1 className="text-xl font-bold text-amber-800">Klosterbrauerei Reutberg</h1>
  </div>
)

function formatRemainingDays(expiryDate: Date): string {
  const now = new Date()
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) return "heute"
  if (diffDays <= 7) return `in ${diffDays} Tagen`
  if (diffDays <= 14) return "in etwa 2 Wochen"
  return `in ${Math.ceil(diffDays / 7)} Wochen`
}

export default async function MitgliedPage({ searchParams }: MitgliedPageProps) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Ungültiger Link</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>
                  Kein gültiger Bearbeitungslink vorhanden. Bitte verwenden Sie den Link, den Sie per E-Mail erhalten
                  haben.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Validate token format before database query
  if (!isValidTokenFormat(token)) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Ungültiger Link</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>
                  Der Bearbeitungslink hat ein ungültiges Format. Bitte verwenden Sie den Link, den Sie per E-Mail erhalten
                  haben.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const supabase = await createClient()

  // Fetch member by token with expiry check in query
  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("token", token)
    .gt("expiry_date", new Date().toISOString())
    .single()

  if (error || !member) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Link nicht gefunden oder abgelaufen</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>
                  Dieser Bearbeitungslink ist ungültig, existiert nicht mehr oder ist abgelaufen. Links sind 4 Wochen gültig. 
                  Bitte wenden Sie sich an die Verwaltung für einen neuen Link.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Additional expiry check (redundant but safe)
  const expiryDate = new Date(member.expiry_date)
  const now = new Date()

  if (now > expiryDate) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Link abgelaufen</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>
                  Dieser Bearbeitungslink ist abgelaufen. Links sind 4 Wochen gültig. Bitte wenden Sie sich an die
                  Verwaltung für einen neuen Link.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const remainingTime = formatRemainingDays(expiryDate)

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <Logo />
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Adressdaten aktualisieren</CardTitle>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                <strong>Liebe Mitglieder,</strong> wir bitten Sie, Ihre aktuelle Anschrift zu überprüfen und bei Bedarf
                zu korrigieren. So stellen wir sicher, dass wichtige Post Sie erreicht.
              </p>
              <p className="leading-relaxed">
                <strong>So geht&apos;s:</strong> Prüfen Sie unten Ihre Adressdaten. Falls sich etwas geändert hat,
                tragen Sie einfach die neuen Angaben ein und klicken Sie am Ende auf &quot;Änderungen speichern&quot;.
              </p>
              <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-amber-800">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  Dieser Link ist noch <strong>{remainingTime}</strong> gültig.
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MemberEditForm member={member} />

            <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
              <p>
                <Link href="/impressum" className="underline hover:text-foreground">
                  Impressum
                </Link>
                {" · "}
                <Link href="/datenschutz" className="underline hover:text-foreground">
                  Datenschutzerklärung
                </Link>
              </p>
              <p className="mt-1">Diese Seite verwendet keine Cookies.</p>
              <p className="mt-2">
                Innovative IT Dienstleistungen?{" "}
                <Link
                  href="https://www.christiangotthardt.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  https://www.christiangotthardt.de/
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
