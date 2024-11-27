"use client"
import * as React from "react"
import { ColumnFiltersState, SortingState } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import DashboardLayout from "@/app/dashboard/layout"
import PageContainer from "@/components/layout/page-container"
import { DataTable } from "@/components/common/data-table"


// import { Icons } from "@/components/icons"
// import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import {
  MessageSquare, MessageSquareDot, MessagesSquare, Loader2,
  Mail,
  Globe,
  PhoneCall,
  User,
  CalendarClock,
  MessageCircle,
  TrendingUp,
  Users,
  PhoneOutgoing,
  PhoneMissed,
  Timer,

  UserCheck,
  Volume2,
  Phone,
  EyeIcon,
  PhoneIncoming,

  Clock,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter, useSearchParams } from "next/navigation"
import henceforthApi from "@/utils/henceforthApi"
import dayjs from "dayjs"
import { Skeleton } from "@/components/ui/skeleton"
import { useGlobalContext } from "@/components/providers/Provider"

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
};

type RecordType = {
  id: number;
  type: 'call' | 'chat';
  srNo: string;
  phoneNo?: string;
  dateTime: string;
  status: string;
  transcript?: Message[];
  name?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  chatContent?: Message[];
  duration?: string;
  callType?: 'incoming' | 'outgoing';
  department?: string;
  agentName?: string;
  callStatus?: 'completed' | 'missed' | 'ongoing';
};



const TranscriptMessage = ({ message }: { message: any }) => (

  <div className='mb-2'>
    <div className="flex items-center gap-2 mb-1">
      <Badge variant="secondary">
        {message?.role == "model" ? "AI" : "User"}
      </Badge>
      <span className="text-sm text-muted-foreground">
        {/* {`00:${(1 + 2) * 15}`} */}
      </span>
    </div>
    <p className="text-gray-600 pl-4">
      {message.text}
    </p>
  </div>
)
const SheetContentComponent = ({ isLoading, selectedRecord }: { isLoading: boolean, selectedRecord:any }) => {
  if (!selectedRecord) return null;
  const [transcript, setTranscript] = React.useState<any[]>([]);
  const {formatDuration}=useGlobalContext()
  React.useEffect(() => {
    const getTranscription = async () => {
      try {
        const apiRes = await henceforthApi.SuperAdmin.getTranscription(selectedRecord?._id);
        setTranscript(apiRes?.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedRecord) {
      getTranscription();
    }
  }, [selectedRecord]);
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : selectedRecord && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg mt-4 font-semibold flex items-center gap-2">
                <>
                  <PhoneCall className="h-5 w-5" />
                  Call Details
                </>
            </h3>
          </div>
          <Separator />
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                  
                        <PhoneIncoming className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Call Type</p>
                        <p className="font-medium capitalize">{"Incoming"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{formatDuration(selectedRecord?.call_duration)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="mb-3">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Call Transcript
                </h4>
                <ScrollArea className="max-h-[400px] overflow-y-scroll w-full rounded-md border p-4">
                  <div className="whitespace-pre-line">
                    {transcript?.map((message: any) => (
                      <TranscriptMessage key={message?._id} message={message} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          <div className="mx-auto w-full flex justify-center">
            <Link href={`/call-management/${selectedRecord?._id}/view`}>
              <Button className="common-btn text-white">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};


export type Payment = {
  id: string
  srNo: number
  dateAndTime: string
  transcript: any
  status: "Completed" | "In progress" | "success" | "failed"
  job_title: string
  created_at: string,
  result: number,
}




function DataTableDemo() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const {formatDuration}=useGlobalContext()
  const searchParams = useSearchParams()
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [callState, setCallState] = React.useState<any>({
    data:[],
    count:0
  });

  const initData = async () => {
    setIsLoading(true);
    try {
      let urlSearchParam = new URLSearchParams();

      if (searchParams.get('page')) {
        urlSearchParam.set("pagination", String(Number(searchParams.get('page')) - 1));
      }else{
        urlSearchParam.set("pagination", String(0));
      }
      if (searchParams.get('search')) {
        urlSearchParam.set("search", String(searchParams.get('search')));
        urlSearchParam.set("pagination", String(Number(0)));
      }
      if (activeTab) {
         if(activeTab!="ALL"){

           urlSearchParam.set("status",activeTab.toString());
         }
        } 
      
      if (searchParams.get('limit')) {
        urlSearchParam.set("limit", String(10));
      }else{

        urlSearchParam.set("limit", String(searchParams.get('limit') ?? 10));
      }
      urlSearchParam.set("type", "CALL");


      let apiRes = await henceforthApi.SuperAdmin.callListing(
        urlSearchParam.toString()
      )
      setCallState(apiRes);

    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    initData();
  }, [searchParams.toString(), activeTab])


  const columns: any = [
    {

      header: "Sr. No.",
      cell: ({ row }: { row: { index: number } }) => {
        const currentPage = Number(searchParams.get("page")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
      }
    },
    {
      header: "Call ID",
      cell: ({ row }: { row: any }) => (
        <p className="flex items-center text-blue-500 gap-2">

          {row.original.call_id.length > 20 ? row.original.call_id.slice(0, 20) : row.original.call_id}

        </p>

      )
    },
    {
      accessorKey: "Call Duration",
      header: "Call Duration",
      cell: ({ row }: { row: { original: { call_duration: number } } }) => (
        <div className="">
          {formatDuration(row.original.call_duration)}
        </div>
      ),
    },

    {

      header: "Date and Time",
      cell: ({ row }: { row:any }) => (
        <div className="">
          {dayjs(row.original.created_at).format("DD MMM YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "last_message",
      header: "Transcript",
      cell: ({ row }: { row: any  }) => {

        return (
          <div>
            <p className="font-normal">
              {row.original?.last_message?.length? row.original?.last_message?.length > 20 ? row.original?.last_message?.slice(0, 20)+"..." : row.original?.last_message:"N/A"}
            </p>
          </div>
        );
      }

    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {

        return (
          <Badge className={`rounded-xl text-white font-medium ${row.original.status === "ACTIVE" ? "bg-blue-400" : "bg-green-500"}`}>
                {row.original.status === "ACTIVE" ? "Active" : "Completed"}
           </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }: { row: { index: number; original: RecordType } }) => {
        const [isSheetOpen, setIsSheetOpen] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const [selectedRecord, setSelectedRecord] = React.useState(null);

        const handleViewRecord = async (record: any) => {
          setSelectedRecord(record);
          setIsLoading(true);
          // Keep the sheet open while loading
          setIsSheetOpen(true);

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setIsLoading(false);
        };

        return (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => handleViewRecord(row.original)}
              >
                <EyeIcon color='gray' />
              </Button>
            </SheetTrigger>

            <SheetContent
              className="w-[100%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 
                      max-w-[100%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[70%] xl:max-w-[50%]
                      max-h-screen overflow-y-auto"
              side="right"
            >
              <SheetContentComponent
                isLoading={isLoading}
                selectedRecord={selectedRecord}
              />
            </SheetContent>
          </Sheet>
        );
      },
    }
  ]

  const skeletonColumns = columns.map((column:any) => ({
    ...column,
    cell: () => <Skeleton className="h-8 w-full" />
  }));

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 mb-4 text-gray-300" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
      <p className="text-sm text-center">There are no calls available for the selected filter.</p>
    </div>
  );
  return (
    <PageContainer>
      <div className="container mx-auto px-6 py-2">
        <div>
          <p className="heading mb-3">Call Management</p>
        </div>

        <Tabs defaultValue="ALL" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 h-12 p-1 bg-gray-100 rounded-full shadow-inner">
            <TabsTrigger
              className={`flex items-center justify-center p-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === "ALL"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:bg-gray-200"
                }`}
              value="ALL"
            >
              <span className={`${activeTab === "ALL"
                ? " text-blue-500 "
                : "text-gray-500 hover:bg-gray-200"
                }`}> All Calls</span>
            </TabsTrigger>
            <TabsTrigger
              className={`flex items-center justify-center p-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === "ACTIVE"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:bg-gray-200"
                }`}
              value="ACTIVE"
            >
              <span className={`${activeTab === "ACTIVE"
                ? " text-blue-500 "
                : "text-gray-500 hover:bg-gray-200"
                }`}> Active Calls</span>
            </TabsTrigger>
            <TabsTrigger
              className={`flex items-center justify-center p-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === "COMPLETE"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:bg-gray-200"
                }`}
              value="COMPLETE"
            >
              <span className={`${activeTab === "COMPLETE"
                ? " text-blue-500 "
                : "text-gray-500 hover:bg-gray-200"
                }`}> Previous Calls</span>
            </TabsTrigger>
          </TabsList>
         { callState?.count>0 && <div className="flex justify-between items-center pt-6">
              <Input
                placeholder="Search and filter"
                className="max-w-sm"
                type="search"
              />
            </div>}
          <TabsContent value="ALL" className="mt-4">
            
            <div className="mx-auto">
            {isLoading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array(5).fill({})}
                  totalItems={0}
                />
              ) : callState?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={callState?.data}
                  totalItems={callState?.count}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="ACTIVE" className="mt-4">
            
            <div className="mx-auto">
            {isLoading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array(5).fill({})}
                  totalItems={0}
                />
              ) : callState?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={callState?.data}
                  totalItems={callState?.count}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="COMPLETE" className="mt-4">
           
            <div className="mx-auto">
            {isLoading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array(5).fill({})}
                  totalItems={0}
                />
              ) : callState?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={callState?.data}
                  totalItems={callState?.count}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DataTableDemo />
    </DashboardLayout>
  )
}