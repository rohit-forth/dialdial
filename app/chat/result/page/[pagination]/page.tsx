"use client"

import * as React from "react"
import {ColumnFiltersState,SortingState,} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/app/dashboard/layout"
import PageContainer from "@/components/layout/page-container"
import { DataTable } from "../data-table"
import { columns } from "../column"

const data:any = [
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
    {
        id: "234234234",
        job_title: "Social Media Assistant",
        status: "Completed",
        created_at: "20 May, 2024",
        result:20,
        updated_at:"20 May, 2024"
    },
]

export type Payment = {
    id: string
    job_title: string
    status: "Completed" | "In progress" | "success" | "failed"
    created_at:string
    result:number
    updated_at:string
}



function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )


    return (
        <PageContainer>

            <div className="w-full">
                <div>
                    <p>Results</p>
                </div>
                <div className="flex justify-between items-center py-4">
                    <Input
                        placeholder="Search and filter"
                        // value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                        // onChange={(event) =>
                        //     table.getColumn("email")?.setFilterValue(event.target.value)
                        // }
                        className="max-w-sm"

                        type="search"
                    />
                    <div className="flex justify-between items-center gap-4">
                        <Button variant={"default"} ><Checkbox className="me-2" />Unselect</Button>
                        <Button variant={"default"} >Export</Button>
                    </div>
                </div>

                <div className=" mx-auto ">
                    <DataTable columns={columns} data={data} totalItems={40}/>
                </div>
                {/* <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div> */}
            </div>
        </PageContainer>
    )
}

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <DataTableDemo />
        </DashboardLayout>
    );
}