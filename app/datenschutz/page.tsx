import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function DatenschutzPage() {
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
            <CardTitle>Datenschutzerklärung</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold">1. Verantwortlicher</h3>
              <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
              <p>
                Klosterbrauerei Reutberg eG
                <br />
                Klosterweg 1<br />
                83679 Sachsenkam
                <br />
                Deutschland
                <br />
                E-Mail: info@klosterbrauerei-reutberg.de
                <br />
                Telefon: +49 (0) 8021 / 9045-0
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Zweck der Datenverarbeitung</h3>
              <p>
                Diese Website dient ausschließlich der Verwaltung der Adressdaten unserer Genossenschaftsmitglieder. Wir
                verarbeiten Ihre Daten, um:
              </p>
              <ul className="list-disc pl-6">
                <li>Sie über wichtige Genossenschaftsangelegenheiten zu informieren</li>
                <li>Einladungen zu Mitgliederversammlungen zu versenden</li>
                <li>Ihnen Ihre Mitgliedschaftsunterlagen zuzustellen</li>
                <li>Die gesetzlich vorgeschriebene Mitgliederverwaltung durchzuführen</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. Rechtsgrundlage</h3>
              <p>Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von:</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Erfüllung des Mitgliedschaftsvertrags
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. c DSGVO</strong> – Erfüllung rechtlicher Verpflichtungen
                  (Genossenschaftsgesetz)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigtes Interesse an der Mitgliederverwaltung
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Verarbeitete Daten</h3>
              <p>Wir verarbeiten folgende Kategorien personenbezogener Daten:</p>
              <ul className="list-disc pl-6">
                <li>Anrede, Vorname, Nachname</li>
                <li>Anschrift (Straße, PLZ, Ort)</li>
                <li>Mitgliedsnummer</li>
                <li>Zusätzliche freiwillige Mitteilungen</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Speicherort und Sicherheit</h3>
              <p>
                <strong>Ihre Daten werden ausschließlich in Deutschland bzw. der EU gespeichert.</strong> Wir nutzen für
                die Speicherung Rechenzentren mit Standort in der Europäischen Union, die den strengen Anforderungen der
                DSGVO entsprechen.
              </p>
              <p>
                Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten gegen zufällige oder
                vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen.
                Dazu gehören:
              </p>
              <ul className="list-disc pl-6">
                <li>Verschlüsselte Datenübertragung (TLS/SSL)</li>
                <li>Zugangsbeschränkungen und Authentifizierung</li>
                <li>Regelmäßige Sicherheitsupdates</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Keine Cookies</h3>
              <p>
                <strong>Diese Website verwendet keine Cookies.</strong> Wir setzen keine Tracking-, Analyse- oder
                Werbe-Cookies ein. Die Seite zur Adressaktualisierung funktioniert vollständig ohne Cookies.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">7. Speicherdauer</h3>
              <p>
                Ihre Daten werden für die Dauer Ihrer Mitgliedschaft und darüber hinaus gemäß den gesetzlichen
                Aufbewahrungsfristen (in der Regel 10 Jahre nach Beendigung der Mitgliedschaft) gespeichert.
              </p>
              <p>
                Die Bearbeitungslinks für die Adressaktualisierung sind jeweils 4 Wochen gültig und werden danach
                automatisch ungültig.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">8. Ihre Rechte</h3>
              <p>Sie haben gemäß DSGVO folgende Rechte:</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Auskunftsrecht (Art. 15)</strong> – Sie können Auskunft über Ihre gespeicherten Daten
                  verlangen
                </li>
                <li>
                  <strong>Berichtigungsrecht (Art. 16)</strong> – Sie können die Berichtigung unrichtiger Daten
                  verlangen
                </li>
                <li>
                  <strong>Löschungsrecht (Art. 17)</strong> – Sie können die Löschung Ihrer Daten verlangen, sofern
                  keine gesetzlichen Aufbewahrungspflichten bestehen
                </li>
                <li>
                  <strong>Einschränkungsrecht (Art. 18)</strong> – Sie können die Einschränkung der Verarbeitung
                  verlangen
                </li>
                <li>
                  <strong>Widerspruchsrecht (Art. 21)</strong> – Sie können der Verarbeitung widersprechen
                </li>
                <li>
                  <strong>Datenübertragbarkeit (Art. 20)</strong> – Sie können Ihre Daten in einem gängigen Format
                  erhalten
                </li>
              </ul>
              <p>Zur Ausübung dieser Rechte wenden Sie sich bitte an: info@klosterbrauerei-reutberg.de</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">9. Beschwerderecht</h3>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die für uns zuständige
                Aufsichtsbehörde ist:
              </p>
              <p>
                Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
                <br />
                Promenade 18
                <br />
                91522 Ansbach
                <br />
                <a
                  href="https://www.lda.bayern.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline"
                >
                  www.lda.bayern.de
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">10. Änderungen dieser Datenschutzerklärung</h3>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den aktuellen rechtlichen
                Anforderungen anzupassen oder Änderungen unserer Leistungen umzusetzen.
              </p>
              <p className="text-muted-foreground">Stand: Januar 2025</p>
            </section>

            <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
              <Link href="/impressum" className="underline hover:text-foreground">
                Impressum
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
