import { MemberEditForm } from "@/components/member-edit-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, Mail } from "lucide-react"
import { isValidTokenFormat } from "@/lib/token"
import type { Member } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

const CONTACT_EMAIL = "verwaltung@klosterbrauerei-reutberg.de"

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
            <CardHeader className="text-center">
              <CardTitle className="text-amber-700">Kein Link vorhanden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                <div className="mb-2 font-semibold">🔗 Bitte verwenden Sie Ihren persönlichen Link zur Adressaktualisierung</div>
                <p className="leading-relaxed mb-3">
                  Um Ihre Adressdaten zu aktualisieren, benötigen Sie den persönlichen Link, den Sie per E-Mail erhalten haben.
                </p>
                <div className="rounded-md bg-white p-3 space-y-3">
                  <div>
                    <p className="font-medium text-amber-900 mb-2">So finden Sie Ihren Link:</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                      <li>Prüfen Sie Ihre E-Mails von der Klosterbrauerei Reutberg</li>
                      <li>Der Link beginnt mit der Adresse dieser Website</li>
                      <li>Klicken Sie auf den Link in der E-Mail</li>
                    </ul>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-medium text-amber-900 mb-2">Ihre Adresse per E-Mail mitteilen</p>
                    <p className="text-amber-800 mb-2">
                      Falls Sie keinen Link haben, können Sie Ihre aktuelle Adresse direkt per E-Mail mitteilen:
                    </p>
                    <div className="flex items-center gap-2 rounded-md bg-amber-100 p-2">
                      <Mail className="h-4 w-4 flex-shrink-0 text-amber-900" />
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=Adressaktualisierung&body=Bitte aktualisieren Sie meine Adressdaten.`}
                        className="text-sm font-medium text-amber-900 underline hover:text-amber-950"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                <p>
                  <Link href="/impressum" className="underline hover:text-foreground">
                    Impressum
                  </Link>
                  {" · "}
                  <Link href="/datenschutz" className="underline hover:text-foreground">
                    Datenschutzerklärung
                  </Link>
                </p>
              </div>
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
            <CardHeader className="text-center">
              <CardTitle className="text-amber-700">Ungültiges Link-Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                <div className="mb-2 font-semibold">⚠️ Der Link zur Adressaktualisierung hat ein ungültiges Format</div>
                <p className="leading-relaxed mb-3">
                  Der verwendete Link entspricht nicht dem erwarteten Format. Bitte verwenden Sie den vollständigen Link aus Ihrer E-Mail.
                </p>
                <div className="rounded-md bg-white p-3 space-y-3">
                  <div>
                    <p className="font-medium text-amber-900 mb-2">Bitte beachten Sie:</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                      <li>Kopieren Sie den Link vollständig aus der E-Mail</li>
                      <li>Der Link sollte mit der Website-Adresse beginnen</li>
                      <li>Vermeiden Sie manuelle Änderungen am Link</li>
                    </ul>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-medium text-amber-900 mb-2">Ihre Adresse per E-Mail mitteilen</p>
                    <p className="text-amber-800 mb-2">
                      Falls Sie Probleme mit dem Link haben, können Sie Ihre aktuelle Adresse direkt per E-Mail mitteilen:
                    </p>
                    <div className="flex items-center gap-2 rounded-md bg-amber-100 p-2">
                      <Mail className="h-4 w-4 flex-shrink-0 text-amber-900" />
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=Adressaktualisierung&body=Bitte aktualisieren Sie meine Adressdaten.`}
                        className="text-sm font-medium text-amber-900 underline hover:text-amber-950"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                <p>
                  <Link href="/impressum" className="underline hover:text-foreground">
                    Impressum
                  </Link>
                  {" · "}
                  <Link href="/datenschutz" className="underline hover:text-foreground">
                    Datenschutzerklärung
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Fetch member directly via admin client (server-side)
  const { createAdminClient } = await import("@/lib/supabase/admin")
  const supabase = createAdminClient()

  let member: Member | null = null
  let errorMessage: string | null = null

  try {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("token", token)
      .gt("expiry_date", new Date().toISOString())
      .single()

    if (error || !data) {
      errorMessage = "Token nicht gefunden oder abgelaufen"
    } else {
      member = data as Member
    }
  } catch (err) {
    errorMessage = "Fehler beim Laden der Daten"
  }

  if (!member || errorMessage) {
    // Check if token exists but is expired
    let isExpired = false
    try {
      const { data: expiredMember } = await supabase
        .from("members")
        .select("expiry_date")
        .eq("token", token)
        .single()

      if (expiredMember) {
        const expiryDate = new Date(expiredMember.expiry_date)
        isExpired = new Date() > expiryDate
      }
    } catch {
      // Ignore errors
    }

    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <Logo />
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className={isExpired ? "text-amber-700" : "text-destructive"}>
                {isExpired ? "Link abgelaufen" : "Link nicht verfügbar"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                <div className="mb-2 font-semibold">
                  {isExpired ? "⏰ Dieser Link ist abgelaufen" : "🔗 Dieser Link ist nicht mehr gültig"}
                </div>
                <p className="mb-3 leading-relaxed">
                  {isExpired
                    ? "Ihr Link zur Adressaktualisierung ist abgelaufen. Bearbeitungslinks sind 4 Wochen gültig."
                    : "Der Link zur Adressaktualisierung konnte nicht gefunden werden oder ist nicht mehr gültig."}
                </p>
                <div className="rounded-md bg-white p-3 space-y-3">
                  <div>
                    <p className="font-medium text-amber-900 mb-2">Was können Sie tun?</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                      <li>Verwenden Sie den aktuellsten Link aus Ihrer E-Mail</li>
                      <li>Prüfen Sie, ob der Link vollständig kopiert wurde</li>
                    </ul>
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-medium text-amber-900 mb-2">Ihre Adresse aktualisieren</p>
                    <p className="text-amber-800 mb-2">
                      Falls Sie keinen gültigen Link haben, können Sie Ihre aktuelle Adresse direkt per E-Mail mitteilen:
                    </p>
                    <div className="flex items-center gap-2 rounded-md bg-amber-100 p-2">
                      <Mail className="h-4 w-4 flex-shrink-0 text-amber-900" />
                      <a
                        href={`mailto:${CONTACT_EMAIL}?subject=Adressaktualisierung&body=Bitte aktualisieren Sie meine Adressdaten.`}
                        className="text-sm font-medium text-amber-900 underline hover:text-amber-950"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                <p>
                  <Link href="/impressum" className="underline hover:text-foreground">
                    Impressum
                  </Link>
                  {" · "}
                  <Link href="/datenschutz" className="underline hover:text-foreground">
                    Datenschutzerklärung
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Extract expiry date from member
  const expiryDate = new Date(member.expiry_date)
  const remainingTime = formatRemainingDays(expiryDate)

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <Logo />
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Adressaktualisierung</CardTitle>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
