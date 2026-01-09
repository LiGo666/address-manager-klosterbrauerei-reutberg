"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Download, Loader2 } from "lucide-react"
import type { Member } from "@/lib/types"
import * as XLSX from "xlsx"
import { createClient } from "@/lib/supabase/client"

interface ExportButtonsProps {
  members: Member[]
  totalCount: number
}

export function ExportButtons({ members, totalCount }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const supabase = createClient()

  const fetchAllMembers = async (): Promise<Member[]> => {
    const allMembers: Member[] = []
    const pageSize = 1000 // Supabase max limit
    let from = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("customer_number", { ascending: true })
        .range(from, from + pageSize - 1)

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        allMembers.push(...data)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    return allMembers
  }

  const getExportData = (membersToExport: Member[]) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

    return membersToExport.map((member) => ({
      ID: member.customer_number,
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

  const exportCSV = async () => {
    setIsExporting(true)
    try {
      const allMembers = await fetchAllMembers()
      const data = getExportData(allMembers)
      if (data.length === 0) {
        setIsExporting(false)
        return
      }

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
      const allMembers = await fetchAllMembers()
      const data = getExportData(allMembers)
      if (data.length === 0) {
        setIsExporting(false)
        return
      }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mitglieder")

    // Auto-size columns
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row] || "").length)),
    }))
    worksheet["!cols"] = colWidths

      XLSX.writeFile(workbook, `mitglieder_export_${new Date().toISOString().split("T")[0]}.xlsx`)
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
