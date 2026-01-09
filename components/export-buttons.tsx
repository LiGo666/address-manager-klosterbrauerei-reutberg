"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Download } from "lucide-react"
import type { Member } from "@/lib/types"
import * as XLSX from "xlsx"

interface ExportButtonsProps {
  members: Member[]
}

export function ExportButtons({ members }: ExportButtonsProps) {
  const getExportData = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

    return members.map((member) => ({
      Mitgliedsnummer: member.customer_number,
      Anrede: member.salutation,
      Vorname: member.first_name,
      Nachname: member.last_name,
      Name2: member.name2,
      Straße: member.street,
      PLZ: member.postal_code,
      Ort: member.city,
      Notizen: member.notes,
      Geändert: member.modified ? "Ja" : "Nein",
      "Geändert am": member.modified_at ? new Date(member.modified_at).toLocaleDateString("de-DE") : "",
      Bearbeitungslink: `${baseUrl}?token=${member.token}`,
    }))
  }

  const exportCSV = () => {
    const data = getExportData()
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(";"),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row] || ""
            // Escape quotes and wrap in quotes if contains special chars
            if (value.includes(";") || value.includes('"') || value.includes("\n")) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(";"),
      ),
    ]

    const csvContent = "\uFEFF" + csvRows.join("\n") // BOM for Excel UTF-8
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `mitglieder_export_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const exportExcel = () => {
    const data = getExportData()
    if (data.length === 0) return

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mitglieder")

    // Auto-size columns
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row] || "").length)),
    }))
    worksheet["!cols"] = colWidths

    XLSX.writeFile(workbook, `mitglieder_export_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const isDisabled = members.length === 0

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {members.length} Mitglied{members.length !== 1 ? "er" : ""} zum Export verfügbar
      </p>

      <div className="flex flex-wrap gap-4">
        <Button onClick={exportCSV} disabled={isDisabled} className="flex-1 sm:flex-none">
          <FileText className="mr-2 h-4 w-4" />
          CSV exportieren
        </Button>
        <Button onClick={exportExcel} disabled={isDisabled} className="flex-1 sm:flex-none">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel exportieren
        </Button>
      </div>

      {members.length > 0 && (
        <div className="rounded-lg border p-4 text-sm">
          <h4 className="mb-2 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export enthält folgende Felder:
          </h4>
          <ul className="list-inside list-disc text-muted-foreground">
            <li>Mitgliedsnummer, Anrede, Vorname, Nachname, Name2</li>
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
