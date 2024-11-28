"use client"
import Link from "next/link"
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
// import {ColumnFiltersState,SortingState,} from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/app/dashboard/layout"
import PageContainer from "@/components/layout/page-container"
import { DataTable } from "@/components/common/data-table"  
//import { columns } from "../column"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, MessageSquareDot, MessagesSquare, Loader2,
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
 
    Clock, } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import henceforthApi from "@/utils/henceforthApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const listingData= [
  
    {
      id: 2,
      type: 'chat' as 'chat',
      srNo: '002',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1987654321',
      country: 'USA',
      department: 'Support',
      agentName: 'Mike Wilson',
      dateTime: '2024-02-14 10:30 AM',
      status: 'completed',
      chatContent: [
        {
          id: 1,
          content: "Hi, I need help with my account settings",
          sender: 'user',
          timestamp: '10:30 AM'
        },
        {
          id: 2,
          content: "Hello! I'd be happy to help you with your account settings. What specific settings are you trying to adjust?",
          sender: 'agent',
          timestamp: '10:31 AM'
        },
        {
          id: 3,
          content: "I can't find where to change my notification preferences",
          sender: 'user',
          timestamp: '10:32 AM'
        },
        {
          id: 4,
          content: "I'll guide you through that process. First, please go to your account dashboard and click on the 'Settings' tab in the top right corner.",
          sender: 'agent',
          timestamp: '10:33 AM'
        }
      ]
    },{
      id: 2,
      type: 'chat' as 'chat',
      srNo: '002',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1987654321',
      country: 'USA',
      department: 'Support',
      agentName: 'Mike Wilson',
      dateTime: '2024-02-14 10:30 AM',
      status: 'completed',
      chatContent: [
        {
          id: 1,
          content: "Hi, I need help with my account settings",
          sender: 'user',
          timestamp: '10:30 AM'
        },
        {
          id: 2,
          content: "Hello! I'd be happy to help you with your account settings. What specific settings are you trying to adjust?",
          sender: 'agent',
          timestamp: '10:31 AM'
        },
        {
          id: 3,
          content: "I can't find where to change my notification preferences",
          sender: 'user',
          timestamp: '10:32 AM'
        },
        {
          id: 4,
          content: "I'll guide you through that process. First, please go to your account dashboard and click on the 'Settings' tab in the top right corner.",
          sender: 'agent',
          timestamp: '10:33 AM'
        }
      ]
    },{
      id: 2,
      type: 'chat' as 'chat',
      srNo: '002',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1987654321',
      country: 'USA',
      department: 'Support',
      agentName: 'Mike Wilson',
      dateTime: '2024-02-14 10:30 AM',
      status: 'completed',
      chatContent: [
        {
          id: 1,
          content: "Hi, I need help with my account settings",
          sender: 'user',
          timestamp: '10:30 AM'
        },
        {
          id: 2,
          content: "Hello! I'd be happy to help you with your account settings. What specific settings are you trying to adjust?",
          sender: 'agent',
          timestamp: '10:31 AM'
        },
        {
          id: 3,
          content: "I can't find where to change my notification preferences",
          sender: 'user',
          timestamp: '10:32 AM'
        },
        {
          id: 4,
          content: "I'll guide you through that process. First, please go to your account dashboard and click on the 'Settings' tab in the top right corner.",
          sender: 'agent',
          timestamp: '10:33 AM'
        }
      ]
    }
  ];

export type Chat = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
    phone_number: string
    country: string
  }


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
    Chatstatus?: 'completed' | 'missed' | 'ongoing';
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
  

  const SheetContentComponent = ({ isLoading, selectedRecord }: { isLoading: boolean, selectedRecord:any}) => {
    if (!selectedRecord) return null;
    const [chatHistory, setChatHistory] = React.useState<any[]>([]);
    
    React.useEffect(() => {
      const getChatHistory = async() => {
        try {
          const apiRes =await henceforthApi.SuperAdmin.getTranscription(selectedRecord?._id);
          setChatHistory(apiRes?.data);
        } catch (error) {
          
        }
      }
      if(selectedRecord){
        getChatHistory();
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
                     
                       
                          <MessageCircle className="h-5 w-5" />
                          Chat Details
                       
                    
                    </h3>
                    {/* <Badge variant={selectedRecord.type === 'call' ? 'default' : 'secondary'}>
                      {selectedRecord.type.toUpperCase()}
                    </Badge> */}
                  </div>
                  
                  <Separator />
                  
                
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
                        <ScrollArea className="max-h-[450px] overflow-y-scroll w-full rounded-md border p-4 bg-background">
                          <div className="space-y-4">
                            {chatHistory?.map((message:any) => (
                              <ChatMessage key={message?._id} message={message} />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  

                  <div className="mx-auto w-full flex justify-center">
                    <Link href={`/chat/${selectedRecord?._id}/view`}>
                      <Button className="bg-dynamic text-white">
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
    job_title: string
    status: "Completed" | "In progress" | "success" | "failed"
    created_at:string
    result:number
    updated_at:string
}



function Contact() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const searchParams = useSearchParams()
 
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [chatState, setChatState] = React.useState<any>({
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
      urlSearchParam.set("type", "CHAT");


      let apiRes = await henceforthApi.SuperAdmin.callListing(
        urlSearchParam.toString()
      )
      setChatState(apiRes);

    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false);
    }
  }


  const columns:any = [
    {
      header:"Sr. No.",
      cell: ({ row }: { row: { index: number; original: RecordType } }) => {
        const currentPage = Number(searchParams.get("page")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
      },
    //   enableSorting: false,
    //   enableHiding: false,
    },
    {
        header:"Chat ID",
        cell: ({ row }: { row: any }) => {
          return <span className="text-blue-500">{row.original?._id}</span>; 
        },
      //   enableSorting: false,
      //   enableHiding: false,
      },
  
    {
      accessorKey: "name",
      header: "Name",
    },
    // {
    //   accessorKey: "job_title",
    //   header: "Job title",
    // },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    // },
  
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "last_message",
      header: "Recent Message",
      cell: ({ row }: { row: any  }) => {

        return (
          <div>
            <p className="font-normal">
              {row.original?.last_message?row.original?.last_message?.length > 20 ? row.original?.last_message?.slice(0, 20)+"..." : row.original.last_message:"N/A"}
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
      accessorKey:"chat",
      header:"Chat",
      cell: ({ row }: { row: { index: number; original: RecordType } })=>{
        const [isSheetOpen, setIsSheetOpen] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const [selectedRecord, setSelectedRecord] = React.useState(null);
        
        const handleViewRecord = async (record:any) => {
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
                <MessagesSquare color='gray'/>
              </Button>
            </SheetTrigger>
            
            <SheetContent
              className="w-[100%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 
              max-w-[100%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[70%] xl:max-w-[50%]
              max-h-screen overflow-y-auto"
              side="right"
            >
              <SheetContentComponent 
                isLoading={isLoading }
                selectedRecord={selectedRecord }
              />
            </SheetContent>
          </Sheet>
        );
      },
      },
    
    
  
  
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
      <p className="text-sm text-center">There are no chats available for the selected filter.</p>
    </div>
  );

  React.useEffect(() => {
    initData();
  }, [searchParams.toString(), activeTab])



    const pathname = usePathname();

    return (
        <PageContainer>

            <div className="container mx-auto px-6 py-2">
                <div>
                    <p className="heading mb-3">{"Chat"}</p>
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
                }`}> All Chats</span>
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
                }`}> Active Chats</span>
            </TabsTrigger>
            <TabsTrigger
              className={`flex items-center justify-center p-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === "COMPLETE"
                ? "bg-primary text-white shadow-md"
                : "text-gray-500 hover:bg-gray-200"
                }`}
              value="COMPLETE"
            >
              <span className={`${activeTab === "COMPLETE"
                ? " text-blue-500"
                : "text-gray-500 hover:bg-gray-200"
                }`}> Previous Chats</span>
            </TabsTrigger>
          </TabsList>

          { chatState?.count>0 && <div className="flex justify-between items-center pt-6">
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
              ) : chatState?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={chatState?.data}
                  totalItems={chatState?.count}
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
              ) : chatState?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={chatState?.data}
                  totalItems={chatState?.count}
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
              ) : chatState?.data?.length === 0 ? (
                <EmptyState />
              ) : (
                <DataTable
                  columns={columns}
                  data={chatState?.data}
                  totalItems={chatState?.count}
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
            <Contact />
        </DashboardLayout>
    );
}