"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
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
  MessagesSquare,
  UserCheck,
  Volume2,
  Phone,
  EyeIcon,
  PhoneIncoming,
  MessageSquare,
  Clock,
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { DataTable } from '@/components/common/data-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import henceforthApi from '@/utils/henceforthApi';
import { Skeleton } from '@/components/ui/skeleton';
import { table } from 'console';
import dayjs from 'dayjs';
type Message = {
  id: number;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
};


const ChatMessage = ({ message }: { message: any }) => (
  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex items-start max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.role === 'user' ? '/user-avatar.png' : '/agent-avatar.png'} />
        <AvatarFallback>{message.role === 'user' ? 'U' : 'A'}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-lg p-3 ${
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          {message.text}
        </div>
        {/* <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {message.timestamp}
        </span> */}
      </div>
    </div>
  </div>
);

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
const SheetContentComponent = ({ isLoading, selectedRecord,isSheetOpen }: { isLoading: boolean, selectedRecord: any,isSheetOpen:boolean }) => {
  if (!selectedRecord) return null;

  const [sheetContent, setSheetContent] = React.useState<any[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastContentLengthRef = useRef(0);

  const getTranscription = async() => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.getTranscription(selectedRecord?._id);
      setSheetContent(apiRes?.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isSheetOpen) {
      getTranscription(); // Call immediately
      intervalId = setInterval(() => {
        getTranscription();
      }, 5000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isSheetOpen]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollArea = scrollAreaRef.current;
        
        // Only scroll to bottom if content length has changed
        if (sheetContent.length !== lastContentLengthRef.current) {
          scrollArea.scrollTop = scrollArea.scrollHeight;
          lastContentLengthRef.current = sheetContent.length;
        }
      }
    };

    scrollToBottom();
    
    const timer = setTimeout(scrollToBottom, 50);

    return () => clearTimeout(timer);
  }, [sheetContent]);
  


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
              {selectedRecord.type === 'CALL' ? (
                <>
                  <PhoneCall className="h-5 w-5" />
                  Call Details
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Chat Details
                </>
              )}
            </h3>
            {/* <Badge variant={selectedRecord.type === 'call' ? 'default' : 'secondary'}>
                    {selectedRecord.type.toUpperCase()}
                  </Badge> */}
          </div>

          <Separator />

          {selectedRecord.type === 'CALL' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{selectedRecord.phoneNo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-medium">{selectedRecord.agentName}</p>
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
                        <p className="font-medium">{selectedRecord.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {selectedRecord.callType === 'incoming' ? (
                        <PhoneIncoming className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Call Type</p>
                        <p className="font-medium capitalize">{selectedRecord.callType}</p>
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
                <ScrollArea  ref={scrollAreaRef}  className="max-h-[400px] overflow-y-scroll w-full rounded-md border p-4">
                  <div className="whitespace-pre-line">
                    {sheetContent?.map((message: any) => (
                      <TranscriptMessage key={message?._id} message={message} />
                    ))}
                  </div>
                  <ScrollBar orientation='vertical'/> 
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedRecord.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedRecord.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedRecord.phoneNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-medium">{selectedRecord.country}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat History
                </h4>
                <ScrollArea  ref={scrollAreaRef} className="max-h-[450px] overflow-y-scroll w-full rounded-md border p-4 bg-background">
                  <div className="space-y-4">
                    {sheetContent?.map((message: any) => (
                      <ChatMessage key={message?._id} message={message} />
                    ))}
                  </div>
                  <ScrollBar orientation='vertical'/>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {


  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter();
  const searchParams = useSearchParams()
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [tableData, setTableData] = React.useState<any>({
    data:[],
    count:0
  });
  const [cardsData, setCardsData] = React.useState<any>({
    data:{
      "active_call": 0,
      "total_call": 0,
      "total_chat": 0
    }
  });
  const [timePeriod, setTimePeriod] = useState('YEAR');
  
  const initCards = async () => {
    try {
      let apiRes = await henceforthApi.SuperAdmin.dashboardCards(timePeriod);
      setCardsData(apiRes);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    initCards();
  }, [timePeriod]);
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
        //urlSearchParam.set("pagination", String(Number(0)));
      }
     

      urlSearchParam.set("status","ACTIVE");
        
      
      if (searchParams.get('limit')) {
        urlSearchParam.set("limit", String(10));
      }else{

        urlSearchParam.set("limit", String(searchParams.get('limit') ?? 10));
      }
      // urlSearchParam.set("type", "");


      let apiRes = await henceforthApi.SuperAdmin.callListing(
        urlSearchParam.toString()
      )
      setTableData(apiRes);

    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  }
  
  const columns:any = [
    {
      header: 'Sr. No.',
      cell: ({ row }:{row:any}) => {
        const currentPage = Number(searchParams.get("page")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
    }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }:{row:any}) => (
        row.original?.type === "CALL" ? <PhoneCall className="h-5 w-5 text-blue-500" /> : <MessagesSquare className="h-5 w-5 text-blue-500" />
      ),
    },
    // {
    //   accessorKey: 'phone_no',
    //   header: 'Phone/Name',
    //   cell: ({ row }:{row:any}) => (row.original.type === 'CALL' ? row.original?.phone_no : row.original?.name),
    // },

    {
      accessorKey: 'dateTime',
      header: 'Date and Time',
      cell: ({ row }:{row:any}) => (dayjs(row.original.created_at).format("DD MMM YYYY")),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }:{row:any}) => {
        if (row.original.type === 'call') {
          return (
            <div>
            <p className="font-normal">
              {row.original?.last_message?.length? row.original?.last_message?.length > 30 ? row.original?.last_message?.slice(0, 30)+"..." : row.original?.last_message:"N/A"}
            </p>
          </div>
          );
        }
        return (
          <div>
          <p className="font-normal">
            {row.original?.last_message?.length? row.original?.last_message?.length > 20 ? row.original?.last_message?.slice(0, 20)+"..." : row.original?.last_message:"N/A"}
          </p>
        </div>
        );
      },
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
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }:{row:any}) => {
        const [isSheetOpen, setIsSheetOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const [selectedRecord, setSelectedRecord] = useState(null);

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
                isSheetOpen={isSheetOpen}
                isLoading={isLoading}
                selectedRecord={selectedRecord}
              />
            </SheetContent>
          </Sheet>
        );
      },
    },
  ];
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

  React.useEffect(() => {
    initCards()
    initData();
  }, [searchParams.toString()])



  

  return (
    <PageContainer scrollable>
      <div className="container mx-auto p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Calls Card */}
          <Card onClick={() => router.push("/call-management/page/1")} className="h-full group relative overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-blue-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
                Active Calls
              </CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground group-hover:text-blue-700 transition-colors duration-300" />
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-bold group-hover:text-blue-700 transition-colors duration-300">
                    {cardsData.data.active_call}
                  </div>
                  {/* <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{cardData.activeCalls.trend} from last hour</span>
                  </div> */}
                </div>
              </div>

            
            </CardContent>
          </Card>

       


          {/* Total Calls Card */}
          <Card onClick={() => router.push("/call-management/page/1")} className="group relative overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-green-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 -mt-4 relative z-10">
              <CardTitle className="text-sm font-medium group-hover:text-green-700 transition-colors duration-300">
                Total Calls
              </CardTitle>
              <div className="flex flex-col items-end">
                <Select
                  defaultValue="YEAR"
                  onValueChange={setTimePeriod}
                >
                  <SelectTrigger
                    className="w-[130px] h-9 text-xs"
                    onClick={e => e.stopPropagation()}
                  >
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="TODAY">Today</SelectItem>
                    <SelectItem value="WEAK">This Week</SelectItem>
                    <SelectItem value="MONTH">This Month</SelectItem>
                    <SelectItem value="YEAR">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Phone className="h-4 w-4 text-muted-foreground group-hover:text-green-700 transition-colors duration-300 mt-2" />
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-bold group-hover:text-green-700 transition-colors duration-300 -mt-6">
                    {cardsData?.data?.total_call}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Chats Card */}
          <Card onClick={() => router.push("/chat/page/1")} className="group relative overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-purple-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium group-hover:text-purple-700 transition-colors duration-300">
                Total Chats
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-purple-700 transition-colors duration-300" />
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl font-bold group-hover:text-purple-700 transition-colors duration-300">
                    {cardsData?.data.total_chat}
                  </div>
                  {/* <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MessagesSquare className="h-4 w-4" />
                    <span>Active: {cardData.totalChats.active}</span>
                  </div> */}
                </div>
              </div>

          
            </CardContent>
          </Card>
        </div>


        {/*Data Table */}


        {isLoading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array(5).fill({})}
                  totalItems={0}
                />
              ) : tableData?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={tableData?.data}
                  totalItems={tableData?.count}
                />
              )}


      </div>
    </PageContainer>
  );
};

export default Dashboard;