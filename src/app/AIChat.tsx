import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import henceforthApi from '@/utils/henceforthApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import countryCode from "@/utils/countryCode.json";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useGlobalContext } from '@/components/providers/Provider';
import gladiatorIcon from "@/app/assets/images/hf_logo.png"
import admin1 from "@/app/assets/images/admin1.png"

import { useSearchParams } from 'next/navigation';
import { set } from 'date-fns';
import DeepgramCall from './AgentCall';
import { decode } from 'punycode';
import { de } from 'date-fns/locale';


interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system' | 'inactivity';
  timestamp: number;
  actions?: 'end_chat' | 'continue_chat' | null;
}

const AIChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [showForm, setShowForm] = useState(true);
  // const [chatId, setChatId] = useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [connecting,setConnecting] = useState(false);
  const {messages,setMessages,companyDetails,getThemeColor,isCallActive,setIsCallActive,getAgentName,agentDetails,showForm,setShowForm,chatId,setChatId,formData,setFormData} = useGlobalContext();
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const searchParams=useSearchParams();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [adminImages, setAdminImages] = useState([admin1]);

  const [countdownTime, setCountdownTime] = useState<number | null>(null);
  
  // Function to format time remaining
 
  useEffect(() => {
    const systemMessage = messages.find(
      msg => msg.sender === 'system' && msg.actions === 'end_chat'
    );
    
    if (systemMessage && countdownTime === null) {
      setCountdownTime(300); // 5 minutes in seconds
    }
  }, [messages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdownTime !== null && countdownTime > 0) {
      timer = setInterval(() => {
        setCountdownTime(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            endChat(); // Automatically end chat when timer reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdownTime]);

  function getRandomAdminImage(){
    return adminImages[Math.floor(Math.random() * adminImages.length)].src;
  }


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
    setFormData((prev:any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setIsInputDisabled(false);
  };

  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const continueChat = () => {
    setMessages(prev => prev.filter(msg => msg.sender !== 'system'));
    setIsInputDisabled(false);
    setCountdownTime(null);
    resetInactivityTimer();
  };

  // Modify your endChat function to reset the countdown
  const endChat = async () => {
    if (chatId) {
      try {
        await henceforthApi?.SuperAdmin.endChat(chatId);
      } catch (error) {
        console.error('Error ending chat:', error);
      }
    }
    setShowForm(true);
    setMessages([]);
    setChatId(null);
    setIsInputDisabled(false);
    setCountdownTime(null);
  };
  
  const [decodedToken, setDecodedToken] = useState<any | null>({
    agent_id: "",
    script_id: "",
    secret_key: ""
  });


  useEffect(()=>{

    function decodeToken(token: string) {
      try {
        // Replace URL-safe characters back
        const normalizedToken = token
          .replace(/-/g, '+')
          .replace(/_/g, '/')
        
        // Add padding if needed
        const padding = normalizedToken.length % 4
        const paddedToken = padding 
          ? normalizedToken + '='.repeat(4 - padding)
          : normalizedToken
    
        // Decode
        const decoded = Buffer.from(paddedToken, 'base64').toString()
        const data=JSON.parse(decoded)
        // console.log(data,"fdchuwgyufvwiubfkiwrbog")
        getAgentName(data?.agent_id);
        getThemeColor(data?.script_id);
        setDecodedToken(data);
      } catch (error) {
        console.error('Error decoding token:', error)
        return null
      }
    }

    const token = searchParams.get("token") || "";
    if (token) {
      decodeToken(token);
    }

   
    
  },[])

 

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
          "agent_id": decodedToken?.agent_id,
          "secret_key": decodedToken?.secret_key
        });
      } else {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          "text": trimmedMessage,
          "agent_id": decodedToken?.agent_id,
          "secret_key": decodedToken?.secret_key
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
    if(!showForm && decodedToken?.agent_id){
      const getInitial = async () => {
        // setIsLoading(true);
        setConnecting(true)
        try {
          // const apiRes = await henceforthApi.SuperAdmin.getInitialMessage(String(decodedToken?.agent_id))
          const aiMessage: ChatMessage = {
            id: generateId(),
            content: agentDetails?.chat_first_message,
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
      country_code: formData.countryCode || null,
      type:"CHAT"
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
    <div className="grid grid-cols-1 grid-flow-row col-span-1  relative ">
      {/* Chat Area */}
      <div className='flex flex-col h-[calc(100vh-6rem)]'>

      
      
         {isCallActive ?(
      <DeepgramCall 
        agentId={decodedToken?.agent_id} 
        secretKey={decodedToken?.secret_key} 
        initialMessage={agentDetails?.call_first_message}
      />
        ):
        <>
        
      <div className="flex-1 relative right-1 h-full w-full mx-auto overflow-hidden  ">
        <ScrollArea className="h-full flex items-center">
          <div className="px-4 py-6 md:px-7 ">
            {showForm ? (
          <div className="flex justify-center mt-[50px] items-center">
          <Card className="w-full border-2 max-w-[500px] xl:max-w-[600px] p-8 bg-white rounded-2xl shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-[32px] font-bold text-center text-lightDynamic mb-8">
                Start chatting
              </h2>
              
              <div className="space-y-5">
                <div>
                  <Label 
                    htmlFor="name" 
                    className="text-lightDynamic font-medium text-base mb-2 block"
                  >
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-200 rounded-lg  placeholder:text-gray-400"
                  />
                </div>
    
                <div>
                  <Label 
                    htmlFor="phoneNumber" 
                    className="text-lightDynamic font-medium text-base mb-2 block"
                  >
                    Phone number
                  </Label>
                  <div className="relative flex">
                  <div className="flex flex-grow gap-2">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) => {
                    setFormData((prev:any) => ({ ...prev, countryCode: value }));
                  }}
                >
                  <SelectTrigger className="w-[90px] h-12 border-gray-200 ">
                    <SelectValue placeholder="+91" />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[250px]">
                    <SelectGroup>
                      {countryCode.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.dial_code}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {country.dial_code}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="h-12  px-4 border border-gray-200 rounded-lg  placeholder:text-gray-400"
                />
              </div>
                  </div>
                </div>
    
                <div>
                  <Label 
                    htmlFor="email" 
                    className="text-lightDynamic font-medium text-base mb-2 block"
                  >
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
                    className="w-full h-12 px-4 border border-gray-200 rounded-lg   placeholder:text-gray-400"
                  />
                </div>
              </div>
    
              <Button 
                type="submit" 
                className="w-full h-12 mt-8 bg-lightDynamic text-white font-medium rounded-lg transition-colors"
              >
                Start chat
              </Button>
            </form>
          </Card>
        </div>
            ) : (
              <div className="flex-1 flex flex-col mx-auto ">
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-16 mt-10">
                  {messages?.map(message => (
                    <div key={message.id} className="relative ">
                      {message.sender !== 'user' && (
                        <div className="absolute -top-10 left-0 ">
                          <div className="w-8 h-8 border-2 rounded-lg overflow-hidden">
                            <img 
                              src={henceforthApi?.FILES?.imageOriginal(agentDetails?.agent_image, gladiatorIcon.src)} 
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
                                 <span className="ml-3">
                                  {Math.floor((300000 - (Date.now() - lastActivityTimeRef.current)) / 60000)}:{Math.floor(((300000 - (Date.now() - lastActivityTimeRef.current)) % 60000) / 1000).toString().padStart(2, '0')}
                                  </span>
                                </Button>
                                <Button onClick={continueChat} variant="outline" size="sm" className="text-xs relative">
                                  <Check className="h-3 w-3 mr-1" /> Continue Chat
                                 
                                </Button>
                              {/* <Button
                                onClick={continueChat}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" /> Continue Chat
                              </Button> */}
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
      
        <div className="p-4 mt-auto group-has-[[data-collapsible=icon]]/sidebar-wrapper:ml-3 bg-white border-t">
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
        
        </>
        }
      </div>

      
    </div>
  );
};

export default AIChat;