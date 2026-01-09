# Umgebungsvariablen

## Erforderliche Umgebungsvariablen

### NextAuth.js
- `AUTH_SECRET` - Secret für NextAuth.js Session-Verschlüsselung
  - Generiere mit: `openssl rand -base64 32`
  - Muss für Production gesetzt sein

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase Projekt-URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key (für Admin-Operationen)
  - WICHTIG: Nie im Client-Code verwenden!
  - Nur für Server-Side API-Routes

### Admin-Authentifizierung
- `ADMIN_PW` - Admin-Passwort (wird gehasht)
- `ADMIN_NAME` - Admin-Benutzername (optional, Standard: "admin")

### Kontakt
- `CONTACT_EMAIL` - E-Mail-Adresse für Adressaktualisierungen (optional, Standard: "verwaltung@klosterbrauerei-reutberg.de")
- `ADMIN_EMAIL` - Alternative Variable für Kontakt-E-Mail (wird verwendet, falls `CONTACT_EMAIL` nicht gesetzt ist)

### Optional
- `NEXT_PUBLIC_URL` - Base URL der Anwendung (für Links in Exports)
- `NEXTAUTH_URL` - NextAuth Base URL (wird automatisch erkannt)

## Vercel Setup

Alle Umgebungsvariablen müssen in Vercel gesetzt werden:
1. Gehe zu Project Settings > Environment Variables
2. Setze für Production, Preview und Development:
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PW`
   - `ADMIN_NAME` (optional)

## Lokale Entwicklung

Erstelle `.env.local` mit allen Variablen.
