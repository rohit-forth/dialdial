import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Loader2,
  X,
  Check,
  Bot
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import henceforthApi from '@/utils/henceforthApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import countryCode from "@/utils/countryCode.json";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from '@/components/ui/avatar';
import { useGlobalContext } from '@/components/providers/Provider';
import gladiatorIcon from "@/app/assets/images/hf_logo.png"

import admin1 from "@/app/assets/images/admin1.png"
import admin2 from "@/app/assets/images/admin2.png"
import admin3 from "@/app/assets/images/admin3.png"
import admin4 from "@/app/assets/images/admin4.png"
import admin5 from "@/app/assets/images/admin5.png"
import admin6 from "@/app/assets/images/admin6.png"
import admin7 from "@/app/assets/images/admin7.png"
import { useSearchParams } from 'next/navigation';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system' | 'inactivity';
  timestamp: number;
  actions?: 'end_chat' | 'continue_chat' | null;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [connecting,setConnecting] = useState(false);
    const {companyDetails,getThemeColor} = useGlobalContext();
  const searchParams=useSearchParams();
  console.log(searchParams.get("ai_agent"))
  console.log("jhufedgwjeuwgrfherhgijuhrtrdhews5j45ej345")
  console.log(searchParams.get("secret_key"))
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [adminImages, setAdminImages] = useState([admin1,admin2,admin3,admin4,admin5,admin6,admin7]);

  function getRandomAdminImage(){
    return adminImages[Math.floor(Math.random() * adminImages.length)].src;
  }

  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phoneNumber: '',
    email: ''
  });

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (!showForm) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
  
      inactivityTimerRef.current = setTimeout(() => {
        const existingSystemMessage = messages.find(
          msg => msg.sender === 'system' && msg.actions === 'end_chat'
        );
  
        if (!existingSystemMessage) {
          const inactivityMessage: ChatMessage = {
            id: `msg_inactivity_${Date.now()}`,
            content: 'Would you like to end this conversation?',
            sender: 'system',
            timestamp: Date.now(),
            actions: 'end_chat'
          };
  
          setMessages(prev => [...prev, inactivityMessage]);
          setIsInputDisabled(true);
        }
      }, 300000);
  
      lastActivityTimeRef.current = Date.now();
    }
  }, [showForm, messages]);

  useEffect(() => {
    const trackActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keydown', trackActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keydown', trackActivity);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setIsInputDisabled(false);
  };

  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const endChat = async () => {
    if (chatId) {
      try {
        await henceforthApi?.SuperAdmin.endChat(chatId);
      } catch (error) {
        console.error('Error ending chat:', error);
      }
    }
    setMessages([]);
    setChatId(null);
    setShowForm(true);
    setIsInputDisabled(false);
  };

  useEffect(()=>{
    if(searchParams.get("script_id")){
      const scriptId = searchParams.get("script_id");
      if (scriptId) {
        getThemeColor(atob(scriptId));
      }
    }
  },[])

  const continueChat = () => {
    setMessages(prev => prev.filter(msg => msg.sender !== 'system'));
    setIsInputDisabled(false);
    resetInactivityTimer();
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: trimmedMessage,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse;
      if (chatId) {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          "text": trimmedMessage,
          "chat_id": chatId,
          "agent_id": atob(searchParams.get("ai_agent") || ""),
          "secret_key": atob(searchParams.get("secret_key") || "")
        });
      } else {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          "text": trimmedMessage,
          "agent_id": atob(searchParams.get("ai_agent") || ""),
          "secret_key": atob(searchParams.get("secret_key") || "")
        });
        setChatId(aiResponse?.data?.chat_id);
      }

      const aiMessage: ChatMessage = {
        id: generateId(),
        content: aiResponse?.data?.ai_response,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in AI response:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: 'Sorry, something went wrong. Please try again.',
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && !isInputDisabled) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if(!showForm){
      const getInitial = async () => {
        // setIsLoading(true);
        setConnecting(true)
        try {
          const apiRes = await henceforthApi.SuperAdmin.getInitialMessage(searchParams.get("ai_agent"))
          const aiMessage: ChatMessage = {
            id: generateId(),
            content: apiRes?.data?.first_message,
            sender: 'ai',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error fetching initial message:', error);
        } finally {
          setConnecting(false)
        }
      }
      getInitial()
    }
  },[showForm]);

  useEffect(() => {
    const payload = {
      email: formData.email,
      name: formData.name || null,
      phone_no: formData.phoneNumber || null,
      country_code: formData.countryCode || null
    }
    if(chatId){
      try {
        henceforthApi.SuperAdmin.submitChatProfile(chatId,payload)
      } catch (error) {
        console.error('Error submitting chat profile:', error);
      }
    }
  },[chatId])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative ">
      {/* Chat Area */}
      <div className="flex-1 relative right-1  w-full mx-auto overflow-hidden  ">
        <ScrollArea className="h-full">
          <div className="px-4 py-6 md:px-7 ">
            {showForm ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <Card className="w-full max-w-md p-6 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold text-center text-gray-900">Start Chatting</h2>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/4">
                        <Label htmlFor="countryCode">Code</Label>
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value) => {
                            setFormData(prev => ({ ...prev, countryCode: value }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className='bg-white max-h-[250px]' >
                            <SelectGroup>
                              {countryCode?.map((country: any) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.dial_code}
                                >
                                  {country.dial_code}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-dynamic hover:bg-mediumDynamic text-white"
                    >
                      Start Chat
                    </Button>
                  </form>
                </Card>
              </div>
            ) : (
              <div className="flex-1 flex flex-col mx-auto ">
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-16 mt-10">
                  {messages.map(message => (
                    <div key={message.id} className="relative ">
                      {message.sender !== 'user' && (
                        <div className="absolute -top-10 left-0 ">
                          <div className="w-8 h-8 border-2 rounded-lg overflow-hidden">
                            <img 
                              src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo, gladiatorIcon.src)} 
                              alt="AI"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-white border-r-4 border-gray-200 border border-r-dynamic shadow rounded-[5px]' 
                        : 'bg-white border-l-4 border-gray-200 border border-l-dynamic rounded-[5px] shadow-sm'
                    } px-4 py-3 `}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          {message.sender === 'system' && (
                            <div className="flex gap-2 mt-3">
                                <Button 
                                onClick={endChat}
                                size="sm"
                                className="bg-dynamic text-white text-xs"
                                >
                                <X className="h-3 w-3 mr-1" /> End Chat
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs relative">
                                  <Check className="h-3 w-3 mr-1" /> Continue Chat
                                  {/* <span className="absolute right-2 text-xs text-gray-500">
                                  {Math.floor((300000 - (Date.now() - lastActivityTimeRef.current)) / 60000)}:{Math.floor(((300000 - (Date.now() - lastActivityTimeRef.current)) % 60000) / 1000).toString().padStart(2, '0')}
                                  </span> */}
                                </Button>
                              <Button
                                onClick={continueChat}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" /> Continue Chat
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {connecting && (
                    <div className="relative">
                      <div className="absolute -top-3 left-4">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img 
                            src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo, gladiatorIcon.src)} 
                            alt="AI"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-200 shadow-sm rounded-3xl rounded-tl-none mt-2 px-4 py-3 inline-block">
                        <div className="flex items-center gap-1 text-gray-500">
                          <span>Connecting</span>
                          <span className="animate-pulse">.</span>
                          <span className="animate-pulse delay-100">.</span>
                          <span className="animate-pulse delay-200">.</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="relative">
                      <div className="absolute -top-7 left-0 mb-5">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img 
                            src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo, gladiatorIcon.src)} 
                            alt="AI"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-100 shadow-sm rounded-3xl mt-2 px-4 py-3 inline-block">
                        <div className="flex gap-1 ">
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
    
             
            </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      { (
        <div className="p-4 mb-10 group-has-[[data-collapsible=icon]]/sidebar-wrapper:ml-3 bg-white border-t">
                <div className=" mx-auto flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isInputDisabled || showForm}
                    placeholder="Type a new message here"
                    className="flex-1 bg-transparent border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-300 rounded-full px-6 py-3 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || isInputDisabled}
                    className="bg-dynamic hover:bg-mediumDynamic text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
      )}
    </div>
  );
};

export default AIChat;