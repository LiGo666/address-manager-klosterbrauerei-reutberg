"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import Papa from "papaparse"
import * as XLSX from "xlsx"

interface FileUploadProps {
  onFileProcessed: (data: Record<string, string>[], headers: string[]) => void
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const processCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const data = (results.data as Record<string, unknown>[]).map((row) => {
          const stringRow: Record<string, string> = {}
          for (const key of Object.keys(row)) {
            const value = row[key]
            stringRow[key] = value == null ? "" : String(value)
          }
          return stringRow
        })
        onFileProcessed(data, headers)
        setIsProcessing(false)
      },
      error: (err) => {
        setError(`CSV-Fehler: ${err.message}`)
        setIsProcessing(false)
      },
    })
  }

  const processExcel = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
        defval: "",
        raw: false, // Force string conversion
      })

      if (rawData.length === 0) {
        setError("Die Excel-Datei enthält keine Daten")
        setIsProcessing(false)
        return
      }

      const jsonData = rawData.map((row) => {
        const stringRow: Record<string, string> = {}
        for (const key of Object.keys(row)) {
          const value = row[key]
          stringRow[key] = value == null ? "" : String(value)
        }
        return stringRow
      })

      const headers = Object.keys(jsonData[0])
      onFileProcessed(jsonData, headers)
      setIsProcessing(false)
    } catch {
      setError("Fehler beim Verarbeiten der Excel-Datei")
      setIsProcessing(false)
    }
  }

  const handleFile = useCallback(
    (file: File) => {
      setError(null)
      setIsProcessing(true)

      const fileName = file.name.toLowerCase()

      if (fileName.endsWith(".csv")) {
        processCSV(file)
      } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
        processExcel(file)
      } else {
        setError("Bitte laden Sie eine CSV- oder Excel-Datei hoch (.csv, .xls, .xlsx)")
        setIsProcessing(false)
      }
    },
    [onFileProcessed],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="mb-2 text-lg font-medium">Datei hierher ziehen</p>
        <p className="mb-4 text-sm text-muted-foreground">oder klicken Sie auf den Button</p>
        <label>
          <input
            type="file"
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
          <Button asChild disabled={isProcessing}>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {isProcessing ? "Verarbeitung läuft..." : "Datei auswählen"}
            </span>
          </Button>
        </label>
        <p className="mt-4 text-xs text-muted-foreground">Unterstützte Formate: CSV, XLS, XLSX</p>
      </div>
    </div>
  )
}
