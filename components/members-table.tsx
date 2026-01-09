"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Clock, ExternalLink, Copy, CheckCircle, RefreshCw, QrCode } from "lucide-react"
import type { Member } from "@/lib/types"
import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MembersTableProps {
  members: Member[]
  isLoading: boolean
  onRenewLink?: (member: Member) => void
}

export function MembersTable({ members, isLoading, onRenewLink }: MembersTableProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

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

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Mitgliedsnr.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Änderungen</TableHead>
              <TableHead>Link gültig</TableHead>
              <TableHead>QR</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const expiryBadge = getExpiryBadge(member.expiry_date)
              const hasChanges =
                member.modified &&
                (member.original_street !== member.street ||
                  member.original_postal_code !== member.postal_code ||
                  member.original_city !== member.city)

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
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasChanges ? (
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
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Geändert am {formatDate(member.modified_at)}</p>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRenewLink(member)}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link erneuern</p>
                          </TooltipContent>
                        </Tooltip>
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
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
