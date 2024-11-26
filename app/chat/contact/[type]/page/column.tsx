"use client"

import { Icons } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    header:"Sr. No.",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>; 
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "job_title",
    header: "Job title",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "conact_number",
    header: "Contact Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "updated_at",
    header: "Last updated",
  },
  {
    accessorKey:"notes",
    header:"Notes",
    cell: ({ row }) => (
            <span ><Icons.Notes /></span>
    ),
    enableSorting: false,
    enableHiding: false,
  }
  


]
