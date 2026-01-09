# Database Setup

Dieses Verzeichnis enthält Skripte für das Einrichten und Verwalten der Datenbank.

## Automatische Validierung beim Build

Das Projekt validiert automatisch die Datenbank-Struktur vor jedem Build. Wenn die `members` Tabelle nicht existiert oder fehlerhaft ist, schlägt der Build fehl.

## Datenbank einrichten

### Option 1: Supabase Dashboard (Empfohlen)

1. Gehe zu deinem Supabase Projekt Dashboard
2. Navigiere zum **SQL Editor**
3. Öffne die Datei `scripts/setup-database.sql`
4. Kopiere den gesamten Inhalt
5. Füge ihn in den SQL Editor ein
6. Führe das Skript aus

### Option 2: Supabase CLI

```bash
# Stelle sicher, dass du mit deinem Supabase Projekt verbunden bist
supabase link --project-ref dein-project-ref

# Führe das SQL-Skript aus
supabase db execute --file scripts/setup-database.sql
```

### Option 3: Manuelle Ausführung

Falls du die SQL-Befehle manuell ausführen möchtest, findest du die vollständige Struktur in `scripts/setup-database.sql`.

## Validierung testen

Du kannst die Datenbank-Validierung manuell testen:

```bash
pnpm db:validate
```

Dieser Befehl prüft:
- Ob die `members` Tabelle existiert
- Ob alle erforderlichen Spalten vorhanden sind
- Ob die Datenbank-Struktur korrekt ist

## Erforderliche Spalten

Die `members` Tabelle muss folgende Spalten haben:

- `id` (UUID, Primary Key)
- `customer_number` (TEXT, UNIQUE, NOT NULL)
- `first_name` (TEXT, NOT NULL)
- `last_name` (TEXT, NOT NULL)
- `street` (TEXT, NOT NULL)
- `postal_code` (TEXT, NOT NULL)
- `city` (TEXT, NOT NULL)
- `token` (TEXT, UNIQUE, NOT NULL)
- `expiry_date` (TIMESTAMPTZ, NOT NULL)
- `modified` (BOOLEAN)
- `original_street` (TEXT)
- `original_postal_code` (TEXT)
- `original_city` (TEXT)
- `created_at` (TIMESTAMPTZ)

## Fehlerbehebung

### Build schlägt fehl mit "Members table does not exist"

1. Stelle sicher, dass die Umgebungsvariablen `NEXT_PUBLIC_SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` (oder `NEXT_PUBLIC_SUPABASE_ANON_KEY`) gesetzt sind
2. Führe `scripts/setup-database.sql` in Supabase SQL Editor aus
3. Teste die Validierung erneut mit `pnpm db:validate`

### "Database schema validation failed"

Die Tabelle existiert, aber es fehlen Spalten. Führe `scripts/setup-database.sql` erneut aus, um fehlende Spalten hinzuzufügen.

## Automatische Validierung

Die Datenbank-Validierung läuft automatisch vor jedem Build über den `prebuild` Hook. Wenn die Datenbank-Struktur nicht korrekt ist, schlägt der Build fehl und verhindert ein fehlerhaftes Deployment.
