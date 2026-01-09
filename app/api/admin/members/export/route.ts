import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Member } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"

    const supabase = createAdminClient()

    // Fetch all members
    const allMembers: Member[] = []
    const pageSize = 1000
    let from = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("customer_number", { ascending: true })
        .range(from, from + pageSize - 1)

      if (error) throw error

      if (data && data.length > 0) {
        allMembers.push(...data)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    const exportData = allMembers.map((member) => ({
      ID: member.customer_number,
      Anrede: member.salutation,
      Vorname: member.first_name,
      Nachname: member.last_name,
      Name2: member.name2,
      Straße: member.street,
      PLZ: member.postal_code,
      Ort: member.city,
      "E-Mail": member.email || "",
      Telefon: member.phone || "",
      Handy: member.mobile || "",
      "Kommunikationspräferenz": member.communication_preference || "",
      Notizen: member.notes,
      Geändert: member.modified ? "Ja" : "Nein",
      "Geändert am": member.modified_at ? new Date(member.modified_at).toLocaleDateString("de-DE") : "",
      Bearbeitungslink: `${baseUrl}/mitglied?token=${member.token}`,
    }))

    if (format === "csv") {
      // Convert to CSV
      const headers = Object.keys(exportData[0] || {})
      const csvRows = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => {
              const value = row[header as keyof typeof row]
              return typeof value === "string" && value.includes(",") ? `"${value}"` : value
            })
            .join(",")
        ),
      ]

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="mitglieder-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    } else {
      // Excel format
      const XLSX = await import("xlsx")
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mitglieder")

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="mitglieder-${new Date().toISOString().split("T")[0]}.xlsx"`,
        },
      })
    }
  } catch (error: any) {
    console.error("Error in GET /api/admin/members/export:", error)
    return NextResponse.json({ error: "Failed to export members" }, { status: 500 })
  }
}
