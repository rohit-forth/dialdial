"use client"
import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Globe,
  Clock,
  ChevronRight,
  Menu,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardLayout from '@/app/dashboard/layout';
import PageContainer from '@/components/layout/page-container';
import henceforthApi from '@/utils/henceforthApi';
import { useParams } from 'next/navigation';



const ChatDetailPage = () => {
  const [chatLoading,setChatloading]=React.useState(false);
  const [chatHistory, setChatHistory] = React.useState()as any;
  const params=useParams();
  const chatDetails = {
    name: "Cameron Williamson",
    email: "c.williamson@gmail.com",
    phone: "+1 234 567 8900",
    country: "United States",
    avatar: "/placeholder-avatar.jpg",
  };

  const initChatHistory = async () => {
    setChatloading(true);
    try {
      const apiRes=await henceforthApi.SuperAdmin.getTranscription(String(params?._id));
      setChatHistory(apiRes?.data);
    } catch (error) {
      
    }finally{
      setChatloading(false);
    }
  }


  useEffect(() => {
    initChatHistory();
  },[]);

  const UserDetailsPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={chatDetails.avatar} />
          <AvatarFallback>CW</AvatarFallback>
        </Avatar>
        <div>
          <Badge variant="outline" className="text-blue-500 border-blue-500 mb-2">
            Chat ID: #123456
          </Badge>
          <h2 className="text-2xl font-bold">
            {chatDetails.name}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Mail className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{chatDetails.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Phone className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{chatDetails.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Globe className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="font-medium">{chatDetails.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Active</p>
            <p className="font-medium">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageContainer scrollable>
      <div className="max-h-screen flex flex-col">
        {/* Main Container */}
        <div className="flex flex-1 overflow-hidden">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col border border-gray rounded-lg h-[calc(100vh-7rem)]">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between shrink-0 text-white common-btn rounded-t-lg"> {/* Added shrink-0 */}
            <div className="flex items-center  gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={chatDetails.avatar} />
                <AvatarFallback>CW</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{chatDetails.name}</h2>
                <p className="text-sm ">Online</p>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <UserDetailsPanel />
              </SheetContent>
            </Sheet>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 overflow-y-auto"> {/* Modified ScrollArea */}
            <div className="space-y-4 p-4">
              {chatLoading?<div className="flex min-h-screen  justify-center h-full">
          <Loader className="h-8 w-8 animate-spin" />
        </div>:Array.isArray(chatHistory) && chatHistory?.map((item, index) => (
                <div key={index} className={`flex ${item?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start max-w-[70%] ${item.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={item.role === 'user' ? '/user-avatar.png' : '/agent-avatar.png'} />
                      <AvatarFallback>{item.role === 'user' ? 'U' : 'A'}</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-lg p-3 ${
                        item.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {item?.text}
                      </div>
                      {/* <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* User Details Panel - Hidden on mobile */}
        <div className="hidden lg:block w-80  p-6 overflow-y-auto"> {/* Added overflow-y-auto */}
          <UserDetailsPanel />
        </div>
      </div>
    </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ChatDetailPage />
    </DashboardLayout>
  );
}