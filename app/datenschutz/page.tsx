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
              <p className="text-base">
                Der Umgang mit Ihren persönlichen Daten ist uns ein Anliegen. Wir befolgen die gesetzlichen Bestimmungen zum Datenschutz (insbesondere BDSG und TMG). Es ist uns wichtig, dass Sie darüber Kenntnis haben, welche Daten wir speichern und wie wir Sie verwenden. Wir bitten Sie, sich Zeit zu nehmen und das Nachfolgende zu lesen.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">1. Datenschutz auf einen Blick</h3>
              <h4 className="text-base font-semibold mt-4">Allgemeine Hinweise</h4>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie eine Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Datenerfassung auf unserer Website</h4>
              <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
              <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
              
              <p><strong>Wie werden Daten erfasst?</strong></p>
              <p>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie z.B. in ein Kontaktformular eingeben.
              </p>
              <p>
                Andere Daten werden automatisch beim Besuch der Website durch IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.
              </p>
              
              <p><strong>Wofür werden Ihre Daten genutzt?</strong></p>
              <p>
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
              </p>
              
              <p><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
              <p>
                Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im jeweiligen Impressum angegebenen Adresse wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Analyse-Tools und Tools von Drittanbietern</h4>
              <p>
                Beim Besuch einer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. Detaillierte Informationen dazu finden Sie in der folgenden Datenschutzerklärung.
              </p>
              <p>
                Sie können dieser Analyse widersprechen. Über die Widerspruchsmöglichkeiten werden wir Sie in dieser Datenschutzerklärung informieren.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">2. Allgemeine Hinweise und Pflichtinformationen</h3>
              
              <h4 className="text-base font-semibold mt-4">Datenschutzbeauftragter</h4>
              <p>
                Kein Datenschutzbeauftragter, die Anzahl der Beschäftigten gem. § 38 BDSG i.V. m. Artikel 37 Abs. 2 DSGVO wird nicht erfüllt.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Datenschutz</h4>
              <p>
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
              </p>
              <p>
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Hinweis zur verantwortlichen Stelle</h4>
              <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
              <p>
                Klosterbrauerei Reutberg eG,
                <br />
                Am Reutberg 3,
                <br />
                83679 Sachsenkam,
                <br />
                Tel: 08021 / 258
              </p>
              <p>
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h4>
              <p>
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h4>
              <p>
                Im Falle datenschutzrechtlicher Verstöße steht dem Betroffenen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde in datenschutzrechtlichen Fragen ist der Landesdatenschutzbeauftragte des Bundeslandes, in dem unser Unternehmen seinen Sitz hat. Eine Liste der Datenschutzbeauftragten sowie deren Kontaktdaten können folgendem Link entnommen werden:{" "}
                <a
                  href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline"
                >
                  https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html
                </a>
              </p>
              
              <h4 className="text-base font-semibold mt-4">Recht auf Datenübertragbarkeit</h4>
              <p>
                Über die Internetseite der Klosterbrauerei werden keine vertrauliche Daten (Bestellungen, Kundendaten, Bankdaten usw.) übermittelt.
              </p>
              <p>
                Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Widerspruch gegen Werbe-Mails</h4>
              <p>
                Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">3. Datenerfassung auf unserer Website</h3>
              
              <h4 className="text-base font-semibold mt-4">Cookies</h4>
              <p>
                <strong>Die Internetseite verwendet KEINE so genannte Cookies.</strong>
              </p>
              <p>
                Allgemein: Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
              </p>
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browser aktivieren. Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
              </p>
              <p>
                Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs oder zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (z.B. Warenkorbfunktion) erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert. Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von Cookies zur technisch fehlerfreien und optimierten Bereitstellung seiner Dienste. Soweit andere Cookies (z.B. Cookies zur Analyse Ihres Surfverhaltens) gespeichert werden, werden diese in dieser Datenschutzerklärung gesondert behandelt.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Server-Log-Dateien</h4>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc pl-6">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p>
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
              </p>
              <p>
                Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. b DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
              </p>
              <p>
                Die Server-Log-Dateien werden für zwei Jahre gespeichert und danach automatisiert durch den Provider gelöscht.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Kontaktformular</h4>
              <p>
                Die Internetseite der Klosterbrauerei Reutberg beinhaltet kein Kontaktformular.
              </p>
              
              <h4 className="text-base font-semibold mt-4">Registrierung auf dieser Website</h4>
              <p>
                Auf der Internetseite der Klosterbrauerei Reutberg gibt es keine Möglichkeit zur Registrierung.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">4. Analyse Tools und Werbung</h3>
              <p>
                Die Internetseite der Klosterbrauerei Reutberg nutzt nur einen Besucherzähler. Es wird keine weitere Analyse seitens der Klosterbrauerei Reutberg durchgeführt.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">5. Plugins und Tools</h3>
              
              <h4 className="text-base font-semibold mt-4">YouTube</h4>
              <p>
                Unsere Website nutzt Plugins der von Google betriebenen Seite YouTube. Betreiber der Seiten ist die YouTube, LLC, 901 Cherry Ave., San Bruno, CA 94066, USA.
              </p>
              <p>
                Wenn Sie eine unserer mit einem YouTube-Plugin ausgestatteten Seiten besuchen, wird eine Verbindung zu den Servern von YouTube hergestellt. Dabei wird dem YouTube-Server mitgeteilt, welche unserer Seiten Sie besucht haben.
              </p>
              <p>
                Wenn Sie in Ihrem YouTube-Account eingeloggt sind, ermöglichen Sie YouTube, Ihr Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen. Dies können Sie verhindern, indem Sie sich aus Ihrem YouTube-Account ausloggen.
              </p>
              <p>
                Die Nutzung von YouTube erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
              </p>
              <p>
                Weitere Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von YouTube unter:{" "}
                <a
                  href="https://www.google.de/intl/de/policies/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline"
                >
                  https://www.google.de/intl/de/policies/privacy
                </a>
              </p>
              
              <h4 className="text-base font-semibold mt-4">Google Web Fonts</h4>
              <p>
                Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts, die von Google bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Web Fonts in ihren Browsercache, um Texte und Schriftarten korrekt anzuzeigen.
              </p>
              <p>
                Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung zu den Servern von Google aufnehmen. Hierdurch erlangt Google Kenntnis darüber, dass über Ihre IP-Adresse unsere Website aufgerufen wurde. Die Nutzung von Google Web Fonts erfolgt im Interesse einer einheitlichen und ansprechenden Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
              </p>
              <p>
                Wenn Ihr Browser Web Fonts nicht unterstützt, wird eine Standardschrift von Ihrem Computer genutzt.
              </p>
              <p>
                Weitere Informationen zu Google Web Fonts finden Sie unter{" "}
                <a
                  href="https://developers.google.com/fonts/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline"
                >
                  https://developers.google.com/fonts/faq
                </a>
                {" "}und in der Datenschutzerklärung von Google:{" "}
                <a
                  href="https://www.google.com/policies/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline"
                >
                  https://www.google.com/policies/privacy/
                </a>
              </p>
              
              <h4 className="text-base font-semibold mt-4">Google Maps</h4>
              <p>
                Diese Seite nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
              </p>
              <p>
                Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Der Anbieter dieser Seite hat keinen Einfluss auf diese Datenübertragung.
              </p>
              <p>
                Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und an einer leichten Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
              </p>
              <p>
                Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google:{" "}
                <a
                  href="https://www.google.de/intl/de/policies/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline"
                >
                  https://www.google.de/intl/de/policies/privacy
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold">6. Haftungshinweis</h3>
              <p>
                Wir übernehmen keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
            </section>

            <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
              <Link href="/impressum" className="underline hover:text-foreground">
                Impressum
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
