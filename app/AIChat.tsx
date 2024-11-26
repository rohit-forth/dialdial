"use client"
import React, { useState, useEffect, useRef } from 'react';

import { 
  Send, 
  Loader2, 
  RefreshCw, 
  MessageCircle, 
  Trash2 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import henceforthApi from '@/utils/henceforthApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import countryCode from "@/utils/countryCode.json";
import { Button } from '@/components/ui/button';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types for Chat Message
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const AIChat: React.FC = () => {
  // State Management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isFormOpen,setIsFormOpen]=useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatId,setChatId]=useState(null);
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '',
    phoneNumber: '',
    email: ''
});
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission

    try {
        
    } catch (error) {
        
    }finally{
        setIsFormOpen(false)
    }
};
  // Effect to scroll to bottom when messages change

  React.useEffect(() => {

    setIsFormOpen(true)
  },[window.onload]);

  
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
 

  useEffect(() => {
    async function submitDetails(){
        if(chatId){
            const payload={
                "email": formData?.email||null,
                "name": formData?.name||null,
                "phone_no": formData?.phoneNumber||null,
                "country_code": formData?.countryCode||null
              }

              try {
                const apiRes=await henceforthApi?.SuperAdmin.submitChatProfile(chatId,payload);
              } catch (error) {
                
              }
        }
    }

    submitDetails()
  },[chatId])


  // Scroll to bottom function

  // Generate unique ID for messages
  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Handle sending message
  const handleSendMessage = async () => {
    // Trim and validate input
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: trimmedMessage,
      sender: 'user',
      timestamp: Date.now()
    };

    // Update messages and clear input
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      if(chatId){
        const aiResponse = await henceforthApi?.SuperAdmin.sendMessage({"text":trimmedMessage,"chat_id":chatId});
      
        const aiMessage: ChatMessage = {
          id: generateId(),
          content: aiResponse?.data?.ai_response,
          sender: 'ai',
          timestamp: Date.now()
        };
  
        // Update messages with AI response
        setMessages(prev => [...prev, aiMessage]);

      }
      else{
        const aiResponse = await henceforthApi?.SuperAdmin.sendMessage({"text":trimmedMessage});
        console.log(aiResponse,"response")
       setChatId(aiResponse?.data?.chat_id)
      const aiMessage: ChatMessage = {
        id: generateId(),
        content: aiResponse?.data?.ai_response,
        sender: 'ai',
        timestamp: Date.now()
      };

      // Update messages with AI response
      setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error in AI response:', error);
      
      // Optional: Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  

  // Handle input submission on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  // Clear chat history
  const clearChatHistory = () => {
    setMessages([]);
  };
  useEffect(() => {
    setTimeout(() => {
        scrollRef?.current?.scrollIntoView({
            behavior: 'instant',
            block: 'end',
        });
    }, 500)
}, [messages])

  return (
    <>
    <Card className="w-full mx-auto h-[calc(100vh-10vh)] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-6 w-6" /> AI Chat
        </CardTitle>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChatHistory}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Clear
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Scrollable Chat Area */}
        <ScrollArea 
         
          className="flex-1 p-4 space-y-4 overflow-y-auto"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Start a conversation with AI
            </div>
          ) : (
            messages?.map(message => (
              <div 
                key={message.id} 
                className={`flex ${
                  message.sender === 'user' 
                    ? 'justify-end' 
                    : 'justify-start'
                } mb-4`}
              >
                <div 
                  className={`h-full  p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {message?.content}
                </div>
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 p-3 rounded-lg flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin text-gray-600" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef}></div>
        </ScrollArea>

        {/* Message Input Area */}
        <div className="p-4 border-t flex items-center space-x-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
           
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="common-btn text-white"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
    <DialogContent className="sm:max-w-[500px] p-10">
        <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>
                Please fill in your contact details below.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>
            <div className="flex gap-4">
                
                <div className="w-[30%]">
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Select
                        value={formData.countryCode}
                        onValueChange={(value) => {setFormData({ ...formData, countryCode: "" }); setFormData({ ...formData, countryCode: value })}}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className='bg-white '>
                            <SelectGroup className=' max-h-[200px] overflow-y-scroll'>
                               
                                {
                                    countryCode?.map((country:any) => ( 
                                        <SelectItem className='hover:bg-gray-200 cursor-pointer' key={country.code} value={country.dial_code}> {country.dial_code}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[70%]">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                </div>
                </div>
            <div>
                <Label htmlFor="email">Email <span className='text-red-500'>*</span></Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                />
            </div>
            
            <DialogFooter className='flex justify-center'>
                <Button  type="submit" className='common-btn text-white'>Submit</Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>
</>
  );
};

export default function ChatPage() {
  return (
   
      <AIChat />
   
  );
}