"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, AlertCircle, X } from "lucide-react"
import type { ColumnMapping } from "@/lib/types"
import { GERMAN_COLUMN_NAMES } from "@/lib/types"

interface ColumnMapperProps {
  headers: string[]
  sampleData: Record<string, string>[]
  onMappingComplete: (mapping: ColumnMapping) => void
  onCancel: () => void
}

const FIELD_LABELS: Record<keyof ColumnMapping, { label: string; required: boolean }> = {
  customerNumber: { label: "ID", required: true },
  salutation: { label: "Anrede", required: false },
  firstName: { label: "Vorname", required: true },
  lastName: { label: "Nachname", required: true },
  name2: { label: "Name2 / Zusatz", required: false },
  street: { label: "Straße", required: true },
  postalCode: { label: "PLZ", required: true },
  city: { label: "Ort", required: true },
  email: { label: "E-Mail", required: false },
  phone: { label: "Telefon", required: false },
  mobile: { label: "Handy", required: false },
  communicationPreference: { label: "Kommunikationspräferenz", required: false },
}

export function ColumnMapper({ headers, sampleData, onMappingComplete, onCancel }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<ColumnMapping>({
    customerNumber: null,
    salutation: null,
    firstName: null,
    lastName: null,
    name2: null,
    street: null,
    postalCode: null,
    city: null,
    email: null,
    phone: null,
    mobile: null,
    communicationPreference: null,
  })

  useEffect(() => {
    const autoMapping: ColumnMapping = {
      customerNumber: null,
      salutation: null,
      firstName: null,
      lastName: null,
      name2: null,
      street: null,
      postalCode: null,
      city: null,
      email: null,
      phone: null,
      mobile: null,
      communicationPreference: null,
    }

    headers.forEach((header) => {
      const normalizedHeader = header.toLowerCase().trim().replace(/[_-]/g, " ")

      // Direct match first
      if (GERMAN_COLUMN_NAMES[normalizedHeader] && !autoMapping[GERMAN_COLUMN_NAMES[normalizedHeader]]) {
        autoMapping[GERMAN_COLUMN_NAMES[normalizedHeader]] = header
        return
      }

      // Partial match for compound headers
      for (const [key, field] of Object.entries(GERMAN_COLUMN_NAMES)) {
        if (!autoMapping[field] && (normalizedHeader.includes(key) || key.includes(normalizedHeader))) {
          autoMapping[field] = header
          break
        }
      }
    })

    setMapping(autoMapping)
  }, [headers])

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: value === "none" ? null : value,
    }))
  }

  const requiredFields: (keyof ColumnMapping)[] = [
    "customerNumber",
    "firstName",
    "lastName",
    "street",
    "postalCode",
    "city",
  ]

  const missingRequired = requiredFields.filter((field) => !mapping[field])
  const isValid = missingRequired.length === 0

  const handleSubmit = () => {
    if (isValid) {
      onMappingComplete(mapping)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Spalten zuordnen</h3>
        <p className="text-sm text-muted-foreground">
          Bitte ordnen Sie die Spalten aus Ihrer Datei den entsprechenden Feldern zu.
        </p>
      </div>

      {!isValid && (
        <Alert className="border-amber-300 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Bitte ordnen Sie alle Pflichtfelder zu (markiert mit *)</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {(Object.keys(FIELD_LABELS) as (keyof ColumnMapping)[]).map((field) => {
          const { label, required } = FIELD_LABELS[field]
          const isMapped = !!mapping[field]
          const isMissing = required && !isMapped

          return (
            <div key={field} className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {isMissing ? <X className="h-5 w-5 text-red-500" /> : <Check className="h-5 w-5 text-green-600" />}
              </div>
              <Label className="w-40 text-sm">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select value={mapping[field] || "none"} onValueChange={(value) => handleMappingChange(field, value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="-- Nicht zugeordnet --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Nicht zugeordnet --</SelectItem>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        })}
      </div>

      {sampleData.length > 0 && (
        <div className="rounded-lg border p-4 bg-muted/30">
          <h4 className="mb-2 font-medium">Vorschau der Zuordnung</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {(Object.keys(FIELD_LABELS) as (keyof ColumnMapping)[]).map((field) => (
                    <th key={field} className="px-2 py-1 text-left font-medium">
                      {FIELD_LABELS[field].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.slice(0, 2).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {(Object.keys(FIELD_LABELS) as (keyof ColumnMapping)[]).map((field) => {
                      const value = mapping[field] ? row[mapping[field] as string] : null
                      const displayValue = value == null ? "-" : String(value) || "-"
                      return (
                        <td key={field} className="px-2 py-1 text-muted-foreground">
                          {displayValue}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} className="bg-amber-500 hover:bg-amber-600 text-white">
          Zuordnung übernehmen
        </Button>
      </div>
    </div>
  )
}
