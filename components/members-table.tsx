"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Clock, ExternalLink, Copy, CheckCircle, RefreshCw, QrCode, ArrowUpDown, ArrowUp, ArrowDown, Search, X, Trash2, Ban } from "lucide-react"
import type { Member } from "@/lib/types"
import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MembersTableProps {
  members: Member[]
  isLoading: boolean
  onRenewLink?: (member: Member, weeks: number) => void
  onDelete?: (member: Member) => void
  onInvalidateToken?: (member: Member) => void
}

type SortColumn = "customer_number" | "name" | "address" | "modified" | "expiry_date" | null
type SortDirection = "asc" | "desc"

export function MembersTable({ members, isLoading, onRenewLink, onDelete, onInvalidateToken }: MembersTableProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlyModified, setShowOnlyModified] = useState(false)

  const getEditLink = (token: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/mitglied?token=${token}`
    }
    return `/mitglied?token=${token}`
  }

  const handleCopyLink = async (token: string) => {
    const link = getEditLink(token)
    await navigator.clipboard.writeText(link)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const handleOpenLink = (token: string) => {
    const link = getEditLink(token)
    window.open(link, "_blank")
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryBadge = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate)
    if (days <= 0) {
      return { variant: "destructive" as const, text: "Abgelaufen" }
    } else if (days <= 7) {
      return { variant: "destructive" as const, text: `${days} Tage` }
    } else if (days <= 14) {
      return { variant: "secondary" as const, text: `${days} Tage` }
    } else {
      return { variant: "outline" as const, text: `${days} Tage` }
    }
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members

    // Filter by modified status
    if (showOnlyModified) {
      filtered = filtered.filter((member) => member.modified)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((member) => {
        const fullName = `${member.salutation} ${member.first_name} ${member.last_name} ${member.name2}`.toLowerCase()
        const address = `${member.street} ${member.postal_code} ${member.city}`.toLowerCase()
        const customerNumber = member.customer_number.toLowerCase()
        return (
          fullName.includes(query) ||
          address.includes(query) ||
          customerNumber.includes(query)
        )
      })
    }

    // Sort
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: string | number | boolean
        let bValue: string | number | boolean

        switch (sortColumn) {
          case "customer_number":
            // Try to parse as number for proper numeric sorting
            const aNum = parseInt(a.customer_number, 10)
            const bNum = parseInt(b.customer_number, 10)
            if (!isNaN(aNum) && !isNaN(bNum)) {
              aValue = aNum
              bValue = bNum
            } else {
              aValue = a.customer_number.toLowerCase()
              bValue = b.customer_number.toLowerCase()
            }
            break
          case "name":
            aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
            bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
            break
          case "address":
            aValue = `${a.city} ${a.postal_code}`.toLowerCase()
            bValue = `${b.city} ${b.postal_code}`.toLowerCase()
            break
          case "modified":
            aValue = a.modified ? 1 : 0
            bValue = b.modified ? 1 : 0
            break
          case "expiry_date":
            aValue = getDaysUntilExpiry(a.expiry_date)
            bValue = getDaysUntilExpiry(b.expiry_date)
            break
          default:
            return 0
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [members, searchQuery, sortColumn, sortDirection, showOnlyModified])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">Keine Mitgliedsdaten vorhanden</p>
        <p className="text-sm text-muted-foreground">Importieren Sie eine CSV- oder Excel-Datei, um zu beginnen.</p>
      </div>
    )
  }

  if (filteredAndSortedMembers.length === 0 && (searchQuery || showOnlyModified)) {
    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Nach Name, Adresse oder ID suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyModified}
                  onChange={(e) => setShowOnlyModified(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
                />
                <span className="text-muted-foreground">Nur Mitglieder mit Änderungen anzeigen</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">Keine Ergebnisse gefunden</p>
            <p className="text-sm text-muted-foreground">
              Versuchen Sie es mit einem anderen Suchbegriff oder{" "}
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => {
                  setSearchQuery("")
                  setShowOnlyModified(false)
                }}
              >
                löschen Sie die Filter
              </Button>
              .
            </p>
          </div>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Nach Name, Adresse oder ID suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyModified}
                onChange={(e) => setShowOnlyModified(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
              />
              <span className="text-muted-foreground">Nur Mitglieder mit Änderungen anzeigen</span>
            </label>
            {(searchQuery || showOnlyModified) && (
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredAndSortedMembers.length} von {members.length} Einträgen
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("customer_number")}
                  >
                    ID
                    {getSortIcon("customer_number")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("address")}
                  >
                    Adresse
                    {getSortIcon("address")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("modified")}
                  >
                    Änderungen
                    {getSortIcon("modified")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort("expiry_date")}
                  >
                    Token
                    {getSortIcon("expiry_date")}
                  </Button>
                </TableHead>
                <TableHead>QR</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedMembers.map((member) => {
                const expiryBadge = getExpiryBadge(member.expiry_date)
                const hasChanges =
                  member.modified &&
                  (member.original_street !== member.street ||
                    member.original_postal_code !== member.postal_code ||
                    member.original_city !== member.city ||
                    (member.notes && member.notes.trim().length > 0))

                return (
                  <TableRow key={member.customer_number} className={member.modified ? "bg-green-50" : ""}>
                    <TableCell>
                      {member.modified ? (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3" />
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3" />
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{member.customer_number}</TableCell>
                    <TableCell>
                      <div>
                        {member.salutation && <span>{member.salutation} </span>}
                        {member.first_name} {member.last_name}
                        {member.name2 && <span className="block text-sm text-muted-foreground">{member.name2}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {member.street}
                        <span className="block text-sm text-muted-foreground">
                          {member.postal_code} {member.city}
                        </span>
                        {(member.email || member.phone || member.mobile) && (
                          <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                            {member.email && (
                              <div className="flex items-center gap-1">
                                <span>📧</span>
                                <span className="truncate max-w-[200px]" title={member.email}>
                                  {member.email}
                                </span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-1">
                                <span>📞</span>
                                <span>{member.phone}</span>
                              </div>
                            )}
                            {member.mobile && (
                              <div className="flex items-center gap-1">
                                <span>📱</span>
                                <span>{member.mobile}</span>
                              </div>
                            )}
                            {member.communication_preference && (
                              <div className="text-xs italic text-muted-foreground/80">
                                Präferenz: {member.communication_preference}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {hasChanges || (member.modified && member.notes) ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help text-xs space-y-1">
                              {member.original_street !== member.street && (
                                <div className="text-green-700">
                                  <span className="line-through text-red-500">{member.original_street}</span>
                                  <span className="mx-1">→</span>
                                  <span>{member.street}</span>
                                </div>
                              )}
                              {member.original_postal_code !== member.postal_code && (
                                <div className="text-green-700">
                                  <span className="line-through text-red-500">{member.original_postal_code}</span>
                                  <span className="mx-1">→</span>
                                  <span>{member.postal_code}</span>
                                </div>
                              )}
                              {member.original_city !== member.city && (
                                <div className="text-green-700">
                                  <span className="line-through text-red-500">{member.original_city}</span>
                                  <span className="mx-1">→</span>
                                  <span>{member.city}</span>
                                </div>
                              )}
                              {member.notes && (
                                <div className="text-blue-700 mt-2 pt-2 border-t border-blue-200">
                                  <div className="font-medium">Weitere Informationen:</div>
                                  <div className="mt-1 whitespace-pre-wrap">{member.notes}</div>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <div className="space-y-2">
                              <p>Geändert am {formatDate(member.modified_at)}</p>
                              {member.notes && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="font-medium text-xs mb-1">Weitere Informationen:</p>
                                  <p className="text-xs whitespace-pre-wrap">{member.notes}</p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : member.modified ? (
                        <span className="text-xs text-muted-foreground">Bestätigt (keine Änderungen)</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={expiryBadge.variant}>{expiryBadge.text}</Badge>
                        {onRenewLink && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onRenewLink(member, 1)}>
                                1 Woche
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRenewLink(member, 2)}>
                                2 Wochen
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRenewLink(member, 4)}>
                                4 Wochen
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRenewLink(member, 8)}>
                                8 Wochen
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRenewLink(member, 12)}>
                                12 Wochen
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRenewLink(member, 26)}>
                                26 Wochen (6 Monate)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRenewLink(member, 52)}>
                                52 Wochen (1 Jahr)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              QR-Code für {member.first_name} {member.last_name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center p-4">
                            <QRCodeSVG value={getEditLink(member.token)} size={200} level="M" />
                            <p className="mt-4 text-xs text-muted-foreground text-center break-all max-w-full">
                              {getEditLink(member.token)}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {/* Mini QR for table view */}
                      <div className="hidden">
                        <QRCodeSVG value={getEditLink(member.token)} size={40} level="L" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleOpenLink(member.token)}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link öffnen</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyLink(member.token)}>
                              {copiedToken === member.token ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link kopieren</p>
                          </TooltipContent>
                        </Tooltip>
                        {onInvalidateToken && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Möchten Sie das Token für ${member.first_name} ${member.last_name} (ID: ${member.customer_number}) ungültig machen?`)) {
                                    onInvalidateToken(member)
                                  }
                                }}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Token ungültig machen</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Möchten Sie ${member.first_name} ${member.last_name} (ID: ${member.customer_number}) wirklich löschen?`)) {
                                    onDelete(member)
                                  }
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Löschen</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}
