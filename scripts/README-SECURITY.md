# Sicherheits-Updates - Migrationsanleitung

## Übersicht der Änderungen

Diese Sicherheits-Updates beheben kritische Schwachstellen in der Token-Implementierung:

1. ✅ **Sichere Token-Generierung** - Verwendet jetzt kryptographisch sichere Zufallszahlen
2. ✅ **RLS-Policies korrigiert** - Blockiert abgelaufene Tokens auf Datenbankebene
3. ✅ **Token-Validierung verbessert** - Mehrschichtige Validierung in App und DB
4. ✅ **Token-Wiederverwendung** - Tokens bleiben innerhalb der Gültigkeitsdauer nutzbar

## Migrationsschritte

### 1. RLS-Policies aktualisieren

Führen Sie das SQL-Script aus, um die RLS-Policies zu korrigieren:

```bash
# In Supabase SQL Editor oder via psql
psql -h [your-db-host] -U [user] -d [database] -f scripts/003-fix-rls-policies.sql
```

**Wichtig:** Die neuen Policies blockieren abgelaufene Tokens automatisch. Die Token-Validierung (Token-Matching) erfolgt weiterhin in der Anwendungsschicht, da Supabase RLS auf JWT basiert, nicht auf Query-Parametern.

### 2. Code-Änderungen

Die folgenden Dateien wurden aktualisiert:

- `lib/token.ts` - Neue sichere Token-Generierung
- `components/admin-dashboard.tsx` - Verwendet jetzt `generateSecureToken()`
- `app/mitglied/page.tsx` - Verbesserte Token-Validierung
- `components/member-edit-form.tsx` - Token bleibt nach Update gültig

### 3. Bestehende Tokens

**Wichtig:** Bestehende Tokens im alten Format funktionieren weiterhin, werden aber bei der nächsten Token-Erneuerung durch sichere Tokens ersetzt.

Wenn Sie alle Tokens sofort erneuern möchten:

```sql
-- Alle Tokens erneuern (nur wenn nötig)
-- Dies sollte über die Admin-Oberfläche erfolgen, nicht direkt in der DB
```

## Sicherheitsverbesserungen im Detail

### Token-Generierung

**Vorher:**
```typescript
const token = `${customerNumber}-${now.getTime()}-${Math.random().toString(36).substring(2, 9)}`
```

**Nachher:**
```typescript
const token = generateSecureToken() // 256-bit kryptographisch sicherer Token
```

### RLS-Policies

**Vorher:**
```sql
USING (true)  -- ❌ Jeder kann alles
```

**Nachher:**
```sql
USING (expiry_date > NOW())  -- ✅ Nur nicht-abgelaufene Tokens
```

### Token-Validierung

- Format-Validierung vor Datenbankabfrage
- Expiry-Check in Datenbankabfrage
- Zusätzliche Expiry-Prüfung in App-Logik
- Token bleibt nach Update gültig und kann wiederverwendet werden

## Produktions-Checkliste

- [ ] RLS-Policies wurden angewendet
- [ ] Tokens funktionieren korrekt und bleiben innerhalb der Gültigkeitsdauer nutzbar
- [ ] Logs werden regelmäßig überprüft
- [ ] Admin-Zugriff verwendet Service Role Key (nicht ANON Key)

## Weitere Empfehlungen

1. **Service Role Key für Admin-Operationen**: Verwenden Sie den Service Role Key für Admin-Operationen, nicht die ANON_KEY
2. **HTTPS**: Stellen Sie sicher, dass alle Verbindungen über HTTPS laufen
3. **Token-Länge**: Die neuen Tokens sind 256-bit (32 Bytes), was ausreichend sicher ist
4. **Monitoring**: Überwachen Sie fehlgeschlagene Token-Validierungen für Anomalien

## Support

Bei Fragen oder Problemen wenden Sie sich an den Entwickler.
