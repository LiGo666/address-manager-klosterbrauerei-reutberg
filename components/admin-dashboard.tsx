"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LogOut, Upload, Download, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, Key, Trash2, AlertTriangle } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { ColumnMapper } from "@/components/column-mapper"
import { MembersTable } from "@/components/members-table"
import { ExportButtons } from "@/components/export-buttons"
import type { Member, ColumnMapping } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { generateCuid2Token } from "@/lib/token"
import Image from "next/image"

const PAGE_SIZE = 50 // Anzahl der Mitglieder pro Seite

export function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedData, setUploadedData] = useState<Record<string, string>[]>([])
  const [columnHeaders, setColumnHeaders] = useState<string[]>([])
  const [showMapper, setShowMapper] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [tokenWeeks, setTokenWeeks] = useState(4)
  const [isGeneratingTokens, setIsGeneratingTokens] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Fetch total count
  const fetchTotalCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true })

      if (error) {
        console.error("Error fetching count:", error)
        return 0
      }
      return count || 0
    } catch (err) {
      console.error("Error fetching count:", err)
      return 0
    }
  }, [supabase])

  const fetchMembers = useCallback(async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      // Fetch members with pagination
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("customer_number", { ascending: true })
        .range(from, to)

      if (error) {
        throw error
      }

      setMembers(data || [])
      
      // Fetch total count if not already set or if page changed
      const count = await fetchTotalCount()
      setTotalCount(count)
    } catch (err) {
      console.error("Error fetching members:", err)
      setError(`Fehler beim Laden der Mitglieder: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, fetchTotalCount])

  // Fetch members when page changes
  useEffect(() => {
    fetchMembers(currentPage)
  }, [currentPage, fetchMembers])

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
      // Token will be generated as CUID2 only for new members

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
        token: "", // Will be set to CUID2 for new members
        expiry_date: expiryDate.toISOString(),
        modified: false,
        modified_at: null,
      }
    })

    try {
      // Merge members: Update existing or insert new based on customer_number
      let updated = 0
      let inserted = 0

      for (const member of newMembers) {
        // Check if member exists
        const { data: existing } = await supabase
          .from("members")
          .select("customer_number")
          .eq("customer_number", member.customer_number)
          .single()

        if (existing) {
          // Update existing member - keep existing token, only update data and expiry
          const { data: existingMember } = await supabase
            .from("members")
            .select("token")
            .eq("customer_number", member.customer_number)
            .single()

          const updateData: Partial<Member> = {
            salutation: member.salutation,
            first_name: member.first_name,
            last_name: member.last_name,
            name2: member.name2,
            street: member.street,
            postal_code: member.postal_code,
            city: member.city,
            notes: member.notes,
            expiry_date: member.expiry_date, // Update expiry on import
            // Token stays the same (keep existing CUID2)
          }

          const { error: updateError } = await supabase
            .from("members")
            .update(updateData)
            .eq("customer_number", member.customer_number)

          if (updateError) throw updateError
          updated++
        } else {
          // Insert new member - generate new CUID2 token
          const newMember = {
            ...member,
            token: generateCuid2Token(), // Generate real CUID2 for new member
          }
          const { error: insertError } = await supabase.from("members").insert(newMember)
          if (insertError) throw insertError
          inserted++
        }
      }

      setShowMapper(false)
      setUploadedData([])
      setColumnHeaders([])
      setSuccess(
        `${newMembers.length} Mitglieder verarbeitet: ${inserted} neu eingefügt, ${updated} aktualisiert!`
      )
      setCurrentPage(1) // Reset to first page after import
      await fetchMembers(1)
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

  const handleRenewLink = async (member: Member, weeks: number) => {
    try {
      const now = new Date()
      const newExpiryDate = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)
      // Token stays the same (keep existing CUID2), only update expiry

      const { error } = await supabase
        .from("members")
        .update({
          expiry_date: newExpiryDate.toISOString(),
        })
        .eq("customer_number", member.customer_number)

      if (error) throw error

      setSuccess(
        `Gültigkeit für ${member.first_name} ${member.last_name} wurde auf ${weeks} Wochen verlängert!`
      )
      await fetchMembers(currentPage)
    } catch (err) {
      console.error("Error renewing link:", err)
      setError("Fehler beim Verlängern der Gültigkeit")
    }
  }

  const handleDelete = async (member: Member) => {
    try {
      const { error } = await supabase.from("members").delete().eq("customer_number", member.customer_number)

      if (error) throw error

      setSuccess(`Mitglied ${member.first_name} ${member.last_name} (ID: ${member.customer_number}) wurde gelöscht!`)
      await fetchMembers(currentPage)
    } catch (err) {
      console.error("Error deleting member:", err)
      setError("Fehler beim Löschen des Mitglieds")
    }
  }

  const handleInvalidateToken = async (member: Member) => {
    try {
      // Set expiry to past to invalidate token
      const pastDate = new Date(0).toISOString()

      const { error } = await supabase
        .from("members")
        .update({
          expiry_date: pastDate,
        })
        .eq("customer_number", member.customer_number)

      if (error) throw error

      setSuccess(`Token für ${member.first_name} ${member.last_name} (ID: ${member.customer_number}) wurde ungültig gemacht!`)
      await fetchMembers(currentPage)
    } catch (err) {
      console.error("Error invalidating token:", err)
      setError("Fehler beim Ungültigmachen des Tokens")
    }
  }

  const handleGenerateTokensForAll = async (weeks: number) => {
    try {
      setIsGeneratingTokens(true)
      setError(null)
      setSuccess(null)

      const now = new Date()
      const expiryDate = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)

      // Fetch all members
      const allMembers: Member[] = []
      const pageSize = 1000
      let from = 0
      let hasMore = true

      while (hasMore) {
        const { data, error } = await supabase
          .from("members")
          .select("customer_number")
          .range(from, from + pageSize - 1)

        if (error) throw error

        if (data && data.length > 0) {
          allMembers.push(...(data as Member[]))
          from += pageSize
          hasMore = data.length === pageSize
        } else {
          hasMore = false
        }
      }

      // Update all members with new expiry (keep existing CUID2 tokens)
      let updated = 0
      for (const member of allMembers) {
        const { error: updateError } = await supabase
          .from("members")
          .update({
            expiry_date: expiryDate.toISOString(),
            // Token stays the same (keep existing CUID2)
          })
          .eq("customer_number", member.customer_number)

        if (updateError) {
          console.error(`Error updating token for ${member.customer_number}:`, updateError)
          continue
        }
        updated++
      }

      setSuccess(`Gültigkeit für ${updated} von ${allMembers.length} Mitgliedern auf ${weeks} Wochen gesetzt!`)
      setShowTokenDialog(false)
      await fetchMembers(currentPage)
    } catch (err) {
      console.error("Error generating tokens:", err)
      setError("Fehler beim Erstellen der Tokens")
    } finally {
      setIsGeneratingTokens(false)
    }
  }

  const handleDeleteAll = async () => {
    if (deleteConfirmation !== "LÖSCHEN") {
      setError("Bitte geben Sie 'LÖSCHEN' ein, um zu bestätigen.")
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      setSuccess(null)

      // Delete all members
      const { error: deleteError } = await supabase.from("members").delete().neq("customer_number", "")

      if (deleteError) throw deleteError

      setSuccess(`Alle ${totalCount} Mitglieder wurden erfolgreich gelöscht!`)
      setShowDeleteDialog(false)
      setDeleteConfirmation("")
      setCurrentPage(1)
      await fetchMembers(1)
    } catch (err) {
      console.error("Error deleting all members:", err)
      setError("Fehler beim Löschen aller Daten")
    } finally {
      setIsDeleting(false)
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
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="delete" className="text-destructive data-[state=active]:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Löschen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mitgliederliste</CardTitle>
                <CardDescription>
                  {totalCount > 0 ? (
                    <>
                      Zeige {((currentPage - 1) * PAGE_SIZE) + 1}-{Math.min(currentPage * PAGE_SIZE, totalCount)} von {totalCount} Mitgliedern
                      {" | "}
                      {members.filter((m) => m.modified).length} auf dieser Seite mit Änderungen
                    </>
                  ) : (
                    "Lade..."
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTokenDialog(true)}
                  disabled={isLoading || totalCount === 0}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Gültigkeit für alle setzen
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchMembers(currentPage)} 
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Aktualisieren
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MembersTable
                members={members}
                isLoading={isLoading}
                onRenewLink={handleRenewLink}
                onDelete={handleDelete}
                onInvalidateToken={handleInvalidateToken}
              />
              
              {/* Pagination Controls */}
              {totalCount > PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Seite {currentPage} von {Math.ceil(totalCount / PAGE_SIZE)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Zurück
                    </Button>
                    <div className="flex items-center gap-1">
                      {/* Show page numbers */}
                      {Array.from({ length: Math.min(5, Math.ceil(totalCount / PAGE_SIZE)) }, (_, i) => {
                        const totalPages = Math.ceil(totalCount / PAGE_SIZE)
                        let pageNum: number
                        
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={isLoading}
                            className="min-w-[2.5rem]"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(totalCount / PAGE_SIZE), prev + 1))}
                      disabled={currentPage >= Math.ceil(totalCount / PAGE_SIZE) || isLoading}
                    >
                      Weiter
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
              <ExportButtons members={members} totalCount={totalCount} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delete" className="space-y-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Alle Daten löschen</CardTitle>
              <CardDescription>Löschen Sie alle Mitgliedsdaten unwiderruflich aus der Datenbank</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warnung:</strong> Diese Aktion löscht alle {totalCount} Mitglieder unwiderruflich. Diese
                  Aktion kann nicht rückgängig gemacht werden!
                </AlertDescription>
              </Alert>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={totalCount === 0 || isLoading}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Alle Daten löschen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Token Generation Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gültigkeit für alle Mitglieder setzen</DialogTitle>
            <DialogDescription>
              Setzt die Gültigkeitsdauer für alle {totalCount} Mitglieder auf die gewählte Anzahl Wochen. Bestehende Tokens bleiben unverändert.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="weeks">Gültigkeitsdauer (Wochen)</Label>
              <Select value={tokenWeeks.toString()} onValueChange={(val) => setTokenWeeks(parseInt(val))}>
                <SelectTrigger id="weeks">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Woche</SelectItem>
                  <SelectItem value="2">2 Wochen</SelectItem>
                  <SelectItem value="4">4 Wochen</SelectItem>
                  <SelectItem value="8">8 Wochen</SelectItem>
                  <SelectItem value="12">12 Wochen</SelectItem>
                  <SelectItem value="26">26 Wochen (6 Monate)</SelectItem>
                  <SelectItem value="52">52 Wochen (1 Jahr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <AlertDescription>
                Diese Aktion aktualisiert nur die Gültigkeitsdauer. Bestehende CUID2-Tokens bleiben unverändert.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTokenDialog(false)} disabled={isGeneratingTokens}>
              Abbrechen
            </Button>
            <Button onClick={() => handleGenerateTokensForAll(tokenWeeks)} disabled={isGeneratingTokens}>
              {isGeneratingTokens ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Aktualisiere Gültigkeit...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Gültigkeit setzen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Dialog with double confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Alle Daten löschen</DialogTitle>
            <DialogDescription>
              Diese Aktion löscht <strong>alle {totalCount} Mitglieder</strong> unwiderruflich aus der Datenbank.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erste Warnung:</strong> Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten gehen
                verloren!
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Zweite Warnung:</strong> Geben Sie <strong>"LÖSCHEN"</strong> ein, um zu bestätigen, dass Sie
                wirklich alle Daten löschen möchten.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">Bestätigung eingeben</Label>
              <Input
                id="delete-confirm"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="LÖSCHEN"
                disabled={isDeleting}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDeleteDialog(false)
              setDeleteConfirmation("")
            }} disabled={isDeleting}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={isDeleting || deleteConfirmation !== "LÖSCHEN"}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Lösche...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Endgültig löschen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
