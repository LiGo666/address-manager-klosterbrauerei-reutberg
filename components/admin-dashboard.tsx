"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Upload, Download, RefreshCw, AlertCircle } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { ColumnMapper } from "@/components/column-mapper"
import { MembersTable } from "@/components/members-table"
import { ExportButtons } from "@/components/export-buttons"
import type { Member, ColumnMapping } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

export function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedData, setUploadedData] = useState<Record<string, string>[]>([])
  const [columnHeaders, setColumnHeaders] = useState<string[]>([])
  const [showMapper, setShowMapper] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchMembers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("members").select("*").order("customer_number", { ascending: true })

      if (error) {
        throw error
      }
      setMembers(data || [])
    } catch (err) {
      console.error("Error fetching members:", err)
      setError(`Fehler beim Laden der Mitglieder: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  const handleFileProcessed = (data: Record<string, string>[], headers: string[]) => {
    setUploadedData(data)
    setColumnHeaders(headers)
    setShowMapper(true)
    setActiveTab("import")
    setError(null)
    setSuccess(null)
  }

  const handleMappingComplete = async (mapping: ColumnMapping) => {
    setIsImporting(true)
    setError(null)
    setSuccess(null)

    const newMembers: Omit<Member, "id" | "created_at">[] = uploadedData.map((row) => {
      const now = new Date()
      const expiryDate = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000) // 4 weeks
      const customerNumber = mapping.customerNumber ? row[mapping.customerNumber] : ""
      const token = `${customerNumber}-${now.getTime()}-${Math.random().toString(36).substring(2, 9)}`

      return {
        customer_number: customerNumber,
        salutation: mapping.salutation ? row[mapping.salutation] || "" : "",
        first_name: mapping.firstName ? row[mapping.firstName] || "" : "",
        last_name: mapping.lastName ? row[mapping.lastName] || "" : "",
        name2: mapping.name2 ? row[mapping.name2] || "" : "",
        street: mapping.street ? row[mapping.street] || "" : "",
        postal_code: mapping.postalCode ? row[mapping.postalCode] || "" : "",
        city: mapping.city ? row[mapping.city] || "" : "",
        notes: "",
        token,
        expiry_date: expiryDate.toISOString(),
        modified: false,
        modified_at: null,
      }
    })

    try {
      // Delete existing members first
      const { error: deleteError } = await supabase.from("members").delete().neq("customer_number", "")

      if (deleteError) {
        throw new Error(`Löschen fehlgeschlagen: ${deleteError.message}`)
      }

      // Insert new members
      const { error: insertError } = await supabase.from("members").insert(newMembers)

      if (insertError) {
        throw new Error(`Import fehlgeschlagen: ${insertError.message}`)
      }

      setShowMapper(false)
      setUploadedData([])
      setColumnHeaders([])
      setSuccess(`${newMembers.length} Mitglieder erfolgreich importiert!`)
      await fetchMembers()
      setActiveTab("overview")
    } catch (err) {
      console.error("Error saving members:", err)
      setError(err instanceof Error ? err.message : "Fehler beim Speichern der Mitgliedsdaten")
    } finally {
      setIsImporting(false)
    }
  }

  const handleCancelMapping = () => {
    setShowMapper(false)
    setUploadedData([])
    setColumnHeaders([])
  }

  const handleRenewLink = async (member: Member) => {
    try {
      const now = new Date()
      const newExpiryDate = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000) // 4 weeks
      const newToken = `${member.customer_number}-${now.getTime()}-${Math.random().toString(36).substring(2, 9)}`

      const { error } = await supabase
        .from("members")
        .update({
          token: newToken,
          expiry_date: newExpiryDate.toISOString(),
        })
        .eq("customer_number", member.customer_number)

      if (error) throw error

      setSuccess(`Link für ${member.first_name} ${member.last_name} wurde erneuert!`)
      await fetchMembers()
    } catch (err) {
      console.error("Error renewing link:", err)
      setError("Fehler beim Erneuern des Links")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/images/image.png"
            alt="Reutberger Kloster-Biere Logo"
            width={80}
            height={80}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Klosterbrauerei Reutberg</h1>
            <p className="text-amber-700">Admin-Bereich - Mitglieder-Adressverwaltung</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-500 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mitgliederliste</CardTitle>
                <CardDescription>
                  {members.length} Mitglieder | {members.filter((m) => m.modified).length} mit Änderungen
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchMembers} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Aktualisieren
              </Button>
            </CardHeader>
            <CardContent>
              <MembersTable members={members} isLoading={isLoading} onRenewLink={handleRenewLink} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daten importieren</CardTitle>
              <CardDescription>Laden Sie eine CSV- oder Excel-Datei mit Mitgliedsdaten hoch</CardDescription>
            </CardHeader>
            <CardContent>
              {showMapper ? (
                <ColumnMapper
                  headers={columnHeaders}
                  sampleData={uploadedData.slice(0, 3)}
                  onMappingComplete={handleMappingComplete}
                  onCancel={handleCancelMapping}
                />
              ) : (
                <FileUpload onFileProcessed={handleFileProcessed} />
              )}
              {isImporting && (
                <div className="mt-4 flex items-center justify-center gap-2 text-amber-700">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Import wird verarbeitet...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daten exportieren</CardTitle>
              <CardDescription>Exportieren Sie alle Mitgliedsdaten inkl. Bearbeitungslinks</CardDescription>
            </CardHeader>
            <CardContent>
              <ExportButtons members={members} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
