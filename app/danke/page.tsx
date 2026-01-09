import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function DankePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
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
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Vielen Dank!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ihre Adressdaten wurden erfolgreich aktualisiert und an die Klosterbrauerei Reutberg übermittelt.
            </p>
            <p className="text-sm text-muted-foreground">Sie können dieses Fenster jetzt schließen.</p>

            <div className="mt-6 border-t pt-4 text-xs text-muted-foreground">
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
