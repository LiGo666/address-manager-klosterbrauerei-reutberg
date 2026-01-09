"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import type { Member } from "@/lib/types"

interface MemberEditFormProps {
  member: Member
}

export function MemberEditForm({ member }: MemberEditFormProps) {
  const [street, setStreet] = useState(member.street)
  const [postalCode, setPostalCode] = useState(member.postal_code)
  const [city, setCity] = useState(member.city)
  const [email, setEmail] = useState(member.email || "")
  const [phone, setPhone] = useState(member.phone || "")
  const [mobile, setMobile] = useState(member.mobile || "")
  const [communicationPreference, setCommunicationPreference] = useState(member.communication_preference || "")
  const [notes, setNotes] = useState(member.notes || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/member/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: member.token,
          street,
          postal_code: postalCode,
          city,
          email: email.trim() || null,
          phone: phone.trim() || null,
          mobile: mobile.trim() || null,
          communication_preference: communicationPreference || null,
          notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = "Fehler beim Speichern. Bitte versuchen Sie es erneut."
        
        if (errorData.error) {
          if (errorData.error.includes("expired") || errorData.error.includes("abgelaufen")) {
            errorMessage = "Ihr Bearbeitungslink ist abgelaufen. Bitte verwenden Sie einen aktuellen Link aus Ihrer E-Mail."
          } else if (errorData.error.includes("not found") || errorData.error.includes("nicht gefunden")) {
            errorMessage = "Ihr Bearbeitungslink konnte nicht gefunden werden. Bitte verwenden Sie den Link aus Ihrer E-Mail."
          } else if (errorData.error.includes("Token")) {
            errorMessage = "Ihr Bearbeitungslink ist ungültig. Bitte verwenden Sie den vollständigen Link aus Ihrer E-Mail."
          } else {
            errorMessage = errorData.error
          }
        }
        
        throw new Error(errorMessage)
      }

      router.push("/danke")
    } catch (err: any) {
      console.error("Error saving:", err)
      setError(err.message || "Fehler beim Speichern. Bitte versuchen Sie es erneut.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Ihre Stammdaten</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="salutation">Anrede</Label>
            <Input id="salutation" value={member.salutation || "-"} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname</Label>
            <Input id="firstName" value={member.first_name} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname</Label>
            <Input id="lastName" value={member.last_name} disabled className="bg-muted" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Diese Daten können Sie hier nicht ändern. Bei Fehlern wenden Sie sich bitte an die Verwaltung.
        </p>
      </div>

      {/* Editable fields */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-medium">Ihre Adresse (bearbeitbar)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Straße und Hausnummer *</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              disabled={isLoading}
              placeholder="z.B. Musterstraße 12"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postleitzahl *</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                disabled={isLoading}
                placeholder="z.B. 83679"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ort *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={isLoading}
                placeholder="z.B. Sachsenkam"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact information */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-medium">Ihre Kontaktdaten (optional)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="z.B. max.mustermann@example.com"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                placeholder="z.B. 08021 12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Handynummer</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={isLoading}
                placeholder="z.B. 0171 1234567"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="communicationPreference">Kommunikationspräferenz</Label>
            <Select value={communicationPreference || "none"} onValueChange={(value) => setCommunicationPreference(value === "none" ? "" : value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Bitte wählen Sie Ihre bevorzugte Kontaktart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine Präferenz</SelectItem>
                <SelectItem value="email">E-Mail</SelectItem>
                <SelectItem value="phone">Telefon</SelectItem>
                <SelectItem value="mobile">Handy</SelectItem>
                <SelectItem value="post">Post</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4 border-t pt-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Weitere Information an uns (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            disabled={isLoading}
            placeholder="Falls Sie uns noch etwas mitteilen möchten..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird gespeichert...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Änderungen speichern
          </>
        )}
      </Button>
    </form>
  )
}
