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
                Am Reutberg 3
                <br />
                83679 Sachsenkam
                <br />
                Deutschland
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Vertreten durch</h3>
              <p>
                Vorstandsvorsitzender: August Maerz
                <br />
                Geschäftsführer: Stephan Hoepfl
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Kontakt</h3>
              <p>
                Telefon: 08021 / 258
                <br />
                Fax: 08021 / 17 06
                <br />
                E-Mail: Reutberg-@T-Online.de
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Registereintrag</h3>
              <p>
                Genossenschaftsregister beim Amtsgericht Wolfratshausen
                <br />
                Registernummer: GenR 1000
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Umsatzsteuer-ID</h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
                <br />
                USt-IdNr: DE128373791
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Weitere Angaben</h3>
              <p>
                Berufsaufsichtsbehörde: Berufsgenossenschaft Nahrungs- Genussmittel und Gaststätten
                <br />
                Kammer: Handwerkskammer München und Oberbayern
                <br />
                Berufshaftpflichtversicherung: Allianz
                <br />
                Name des Prüfungsverbandes: Genossenschaftsverband Bayern e.V.
                <br />
                Sitz des Prüfungsverbandes: Türkenstraße 22-24, 80333 München
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Haftungsausschluss</h3>
              <p>
                Die Brauerei prüft und aktualisiert die Informationen auf ihren Webseiten regelmäßig. Trotz aller Sorgfalt können sich die Daten inzwischen verändert haben. Eine Haftung oder Garantie für die Aktualität, Richtigkeit und Vollständigkeit der zur Verfügung gestellten Informationen kann daher nicht übernommen werden.
              </p>
              <p>
                Gleiches gilt auch für alle anderen Webseiten, auf die mittels Hyperlink verwiesen wird. Wir sind für den Inhalt der Webseiten, die aufgrund einer solchen Verbindung erreicht werden, nicht verantwortlich.
              </p>
              <p>
                Inhalt und Gestaltung der Internetseiten sind urheberrechtlich geschützt. Eine Vervielfältigung der Seiten oder ihrer Inhalte bedarf der vorherigen schriftlichen Zustimmung der Genossenschaft, soweit die Vervielfältigung nicht ohnehin gesetzlich gestattet ist.
              </p>
              <p>
                Dieser Haftungsausschluss ist als Teil des Internetangebotes zu betrachten, von dem aus auf diese Seite verwiesen wurde. Sofern Teile oder einzelne Formulierungen dieses Textes der geltenden Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen sollten, bleiben die übrigen Teile des Dokumentes in ihrem Inhalt und ihrer Gültigkeit davon unberührt.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
              <p>
                August Maerz; Vorstandsvorsitzender Genossenschaftsbrauerei Reutberg eG
                <br />
                Stephan Hoepfl, Geschäftsführer Genossenschaftsbrauerei Reutberg eG
                <br />
                <br />
                Erstellt wird die Seite von Rainer Gast.
                <br />
                <br />
                Die Verantwortlichen sind unter der oben angegebenen Anschrift zu erreichen.
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
