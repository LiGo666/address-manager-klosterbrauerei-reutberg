"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import type { Member } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface MemberEditFormProps {
  member: Member
}

export function MemberEditForm({ member }: MemberEditFormProps) {
  const [street, setStreet] = useState(member.street)
  const [postalCode, setPostalCode] = useState(member.postal_code)
  const [city, setCity] = useState(member.city)
  const [notes, setNotes] = useState(member.notes || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const updateData: Record<string, unknown> = {
        street,
        postal_code: postalCode,
        city,
        notes,
        modified: true,
        modified_at: new Date().toISOString(),
      }

      // If not yet modified, save original values for comparison
      if (!member.modified) {
        updateData.original_street = member.street
        updateData.original_postal_code = member.postal_code
        updateData.original_city = member.city
      }

      const { error: updateError } = await supabase.from("members").update(updateData).eq("token", member.token)

      if (updateError) throw updateError

      router.push("/danke")
    } catch (err) {
      console.error("Error saving:", err)
      setError("Fehler beim Speichern. Bitte versuchen Sie es erneut.")
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
          {member.name2 && (
            <div className="space-y-2">
              <Label htmlFor="name2">Zusatz</Label>
              <Input id="name2" value={member.name2} disabled className="bg-muted" />
            </div>
          )}
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
