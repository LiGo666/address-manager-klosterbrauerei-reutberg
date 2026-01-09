"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Download, Loader2 } from "lucide-react"
import type { Member } from "@/lib/types"

interface ExportButtonsProps {
  members: Member[]
  totalCount: number
}

export function ExportButtons({ members, totalCount }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)


  const exportCSV = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/admin/members/export?format=csv")
      if (!response.ok) {
        throw new Error("Failed to export CSV")
      }
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `mitglieder_export_${new Date().toISOString().split("T")[0]}.csv`
      link.click()
    } catch (err) {
      console.error("Export error:", err)
      alert("Fehler beim Export: " + (err instanceof Error ? err.message : "Unbekannter Fehler"))
    } finally {
      setIsExporting(false)
    }
  }

  const exportExcel = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/admin/members/export?format=xlsx")
      if (!response.ok) {
        throw new Error("Failed to export Excel")
      }
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `mitglieder_export_${new Date().toISOString().split("T")[0]}.xlsx`
      link.click()
    } catch (err) {
      console.error("Export error:", err)
      alert("Fehler beim Export: " + (err instanceof Error ? err.message : "Unbekannter Fehler"))
    } finally {
      setIsExporting(false)
    }
  }

  const isDisabled = totalCount === 0 || isExporting

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {totalCount} Mitglied{totalCount !== 1 ? "er" : ""} zum Export verfügbar
        {isExporting && " (wird geladen...)"}
      </p>

      <div className="flex flex-wrap gap-4">
        <Button onClick={exportCSV} disabled={isDisabled} className="flex-1 sm:flex-none">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportiere...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              CSV exportieren
            </>
          )}
        </Button>
        <Button onClick={exportExcel} disabled={isDisabled} className="flex-1 sm:flex-none">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportiere...
            </>
          ) : (
            <>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel exportieren
            </>
          )}
        </Button>
      </div>

      {totalCount > 0 && (
        <div className="rounded-lg border p-4 text-sm">
          <h4 className="mb-2 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export enthält folgende Felder:
          </h4>
          <ul className="list-inside list-disc text-muted-foreground">
            <li>ID, Anrede, Vorname, Nachname, Name2</li>
            <li>Straße, PLZ, Ort</li>
            <li>Notizen</li>
            <li>Geändert (Ja/Nein), Geändert am</li>
            <li>Bearbeitungslink (vollständige URL)</li>
          </ul>
        </div>
      )}
    </div>
  )
}
