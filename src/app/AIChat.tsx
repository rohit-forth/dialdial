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
    const {companyDetails} = useGlobalContext();
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
      }, 60000);
  
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      <div className="flex-1 max-w-4xl  mx-auto overflow-hidden  ">
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
                      <div className="w-1/3">
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
                      <div className="w-2/3">
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
              <div className="space-y-6">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'ai'&& (
                      <div className="w-8 h-8 rounded-full  flex items-center justify-center mr-2">
                        <img 
                      src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo,gladiatorIcon.src)} 
                      alt="logo" 
                      className='w-7 h-8 rounded-full object-contain  '
                      />

                      </div>
                    )}
                    {
                      message.sender === 'system' && (
                        <div className="w-8 h-8 rounded-full  flex items-center justify-center mr-2">
                          <img 
                            src={getRandomAdminImage()} 
                            alt="logo" 
                            className='w-8 h-8 rounded-full object-cover'
                          />
                        </div>
                      )
                    }
                    <div
                      className={`max-w-2xl p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-mediumDynamic text-white rounded-br-none'
                          : message.sender === 'system'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm md:text-base break-words max-w-lg md:max-w-4xl">{message.content}</p>
                   
                      {message.sender === 'system' && (
                        
                        <div className="flex gap-4 justify-center mt-4">
                          <Button 
                            onClick={endChat} 
                       
                            size="sm" 
                            className="flex bg-mediumDynamic text-white items-center"
                          >
                            <X className="mr-1 h-4 w-4" /> End Chat
                          </Button>
                          <Button 
                            onClick={continueChat} 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                          >
                            <Check className="mr-1 h-4 w-4" /> Continue Chat
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                    
                ))}
                {
                 
                connecting && (
                  <div className="flex justify-center items-center">
                    <span>Connecting</span>
                    <span className="ml-2 animate-pulse">.</span>
                    <span className="animate-pulse animation-delay-200">.</span>
                    <span className="animate-pulse animation-delay-400">.</span>
                  </div>
                )
                }
               
                {isLoading && (
                  <div className="flex items-center space-x-2 ">
                    <div className="w-8 h-8 rounded-full ">
                        <img 
                      src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo,gladiatorIcon.src)} 
                      alt="logo" 
                      className='w-7 h-8 rounded-full object-contain  '
                      />

                      </div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      { (
        <div className=" bg-white mb-14 md:mb-2 p-2 w-full">
            <div className="max-w-3xl border-[1.5px] border-lightDynamic h-full rounded-lg mx-auto flex align-center gap-2 ">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={(isInputDisabled||showForm)}
              placeholder="Type your message..."
              className="min-h-[90px] max-h-[200px] resize-none border-0 text-mediumDynamic"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isInputDisabled}
              className="bg-mediumDynamic mr-2 mt-auto mb-auto rounded-full hover:bg-dynamic text-white px-4  "
            >
              {isLoading ? (
              <Loader2 className="h-5 w-4 animate-spin" />
              ) : (
              <Send className="h-6 w-4" />
              )}
            </Button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;