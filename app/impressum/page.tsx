import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <Link href="/">
            <Image
              src="/images/image.png"
              alt="Reutberger Kloster-Biere Logo"
              width={80}
              height={80}
              className="mx-auto mb-2"
            />
          </Link>
          <h1 className="text-xl font-bold text-amber-800">Klosterbrauerei Reutberg</h1>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Impressum</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold">Angaben gemäß § 5 TMG</h3>
              <p>
                Klosterbrauerei Reutberg eG
                <br />
                Klosterweg 1<br />
                83679 Sachsenkam
                <br />
                Deutschland
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Vertreten durch</h3>
              <p>
                Vorstand der Genossenschaft
                <br />
                (Vertretungsberechtigt gemäß Satzung)
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Kontakt</h3>
              <p>
                Telefon: +49 (0) 8021 / 9045-0
                <br />
                E-Mail: info@klosterbrauerei-reutberg.de
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Registereintrag</h3>
              <p>
                Eingetragen im Genossenschaftsregister
                <br />
                Registergericht: Amtsgericht München
                <br />
                Registernummer: GnR [Nummer]
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Umsatzsteuer-ID</h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
                <br />
                DE [Nummer]
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
              <p>
                Klosterbrauerei Reutberg eG
                <br />
                Klosterweg 1<br />
                83679 Sachsenkam
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Streitschlichtung</h3>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline ml-1"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
              <Link href="/datenschutz" className="underline hover:text-foreground">
                Datenschutzerklärung
              </Link>
              {" · "}
              <Link href="/" className="underline hover:text-foreground">
                Zurück zur Startseite
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
