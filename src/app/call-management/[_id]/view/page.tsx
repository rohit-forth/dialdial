"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  FileText,
  Download,
  Share2,
  Loader,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageContainer from "@/components/layout/page-container";
import { useParams, useSearchParams } from "next/navigation";
import henceforthApi from "@/utils/henceforthApi";
import dayjs from "dayjs";
import { useGlobalContext } from "@/components/providers/Provider";


function DetailPage() {
 const searchParams=useSearchParams();
 const params=useParams();
 const {formatDuration}=useGlobalContext()
 console.log(params,"params");
 const [callDetails,setCallDetails]=React.useState<any>(); 
 const [transcript, setTranscript] = React.useState<any[]>([]);
 const [loadingTranscript, setLoadingTranscript] = React.useState(false);
 const getTranscription = async() => {
  setLoadingTranscript(true);
   try {
     const apiRes =await henceforthApi.SuperAdmin.getTranscription(String(params?._id));
     setTranscript(apiRes?.data);
   } catch (error) {
     
   }finally{
    setLoadingTranscript(false);
   }
 }

 const initDetails=async()=>{
  try {
    const apiRes = await henceforthApi.SuperAdmin.callDetail(String(params?._id));
   
      setCallDetails(apiRes?.data[0]);
   
  } catch (error) {
    console.error(error);
  }
 }
 useEffect(() => {
  initDetails();
  getTranscription()
}, []);
console.log(callDetails,"callDetails");
  return (
    <PageContainer scrollable>
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      {/* Top Card with Call Details */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  Call ID: {callDetails?.call_id}
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                 {callDetails?.status==="COMPLETE"?"Completed":"Active"}
                </Badge>
              </div>
              {/* <CardTitle className="text-2xl font-bold">
                Sales Call with John Doe
              </CardTitle> */}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{dayjs(callDetails?.created_at).format("DD MMM YYYY")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{formatDuration(callDetails?.call_duration)}</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participant</p>
                <p className="font-medium">John Doe</p>
              </div>
            </div> */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">+1 234 567 8900</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Summary</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 leading-relaxed">
              {callDetails?.summary}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Transcript Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Transcript</h2>
        </div>
        <Card>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Speaker 1 */}
                {/* <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">John Doe</Badge>
                    <span className="text-sm text-muted-foreground">00:00</span>
                  </div>
                  <p className="text-gray-600 pl-4">
                    Hello, thank you for joining the call today. We'll be
                    discussing the new product launch strategy.
                  </p>
                </div>

                {/* Speaker 2 */}
                {/* <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Sarah Smith</Badge>
                    <span className="text-sm text-muted-foreground">00:15</span>
                  </div>
                  <p className="text-gray-600 pl-4">
                    Hi John, thanks for having me. I've reviewed the preliminary
                    materials you sent over.
                  </p>
                </div>  */}

                {/* More transcript entries... */}
                {loadingTranscript?<div className="flex min-h-screen  justify-center h-full">
          <Loader className="h-8 w-8 animate-spin" />
        </div>:Array.isArray(transcript) && transcript?.map((item:any,index:number) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {item.role==="model"? "AI" : "User"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {/* {`00:${(index + 2) * 15}`} */}
                      </span>
                    </div>
                    <p className="text-gray-600 pl-4">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </section>
    </div>
    </PageContainer>
  );
}

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <DetailPage />
        </DashboardLayout>
    );
}