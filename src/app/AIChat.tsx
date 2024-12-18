"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  Send,
  Loader2,
  RefreshCw,
  MessageCircle,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import henceforthApi from '@/utils/henceforthApi';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import countryCode from "@/utils/countryCode.json";
import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types for Chat Message
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system' | 'inactivity';
  timestamp: number;
  actions?: 'end_chat' | 'continue_chat' | null;
}

const AIChat: React.FC = () => {
  // State Management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phoneNumber: '',
    email: ''
  });

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    // Only start timer if showForm is false
    if (!showForm) {
      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
  
      // Set new timer
      inactivityTimerRef.current = setTimeout(() => {
        // Check if a system message already exists
        const existingSystemMessage = messages.find(
          msg => msg.sender === 'system' && msg.actions === 'end_chat'
        );
  
        // Only add a new system message if no existing one is present
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
      }, 60000); // 60 seconds
  
      // Update last activity time
      lastActivityTimeRef.current = Date.now();
    }
  }, [showForm, messages]);
  // Effect to handle inactivity and reset timer
  useEffect(() => {
    // Track mouse and keyboard events
    const trackActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keydown', trackActivity);

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keydown', trackActivity);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setIsLoading(true);
    setIsInputDisabled(false);
  };

  // Generate unique ID for messages
  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // End chat and reset
  const endChat = async () => {
    if (chatId) {
      try {
        await henceforthApi?.SuperAdmin.endChat(chatId);
      } catch (error) {
        console.error('Error ending chat:', error);
      }
    }

    // Reset states
    setMessages([]);
    setChatId(null);
    setShowForm(true);
    setIsInputDisabled(false);
  };

  // Continue chat and reset timer
  const continueChat = () => {
    // Remove the last inactivity message
    setMessages(prev => prev.filter(msg => msg.sender !== 'system'));
    setIsInputDisabled(false);
    resetInactivityTimer();
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
      // Send message and get AI response
      let aiResponse;
      if (chatId) {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          "text": trimmedMessage,
          "chat_id": chatId
        });
      } else {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          "text": trimmedMessage
        });
        setChatId(aiResponse?.data?.chat_id);
      }

      const aiMessage: ChatMessage = {
        id: generateId(),
        content: aiResponse?.data?.ai_response,
        sender: 'ai',
        timestamp: Date.now()
      };

      // Update messages with AI response
      setMessages(prev => [...prev, aiMessage]);
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
    if (e.key === 'Enter' && !isLoading && !isInputDisabled) {
      handleSendMessage();
    }
  };

  // Scroll to bottom effect
  useEffect(() => {
    setTimeout(() => {
      scrollRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 500);
  }, [messages]);

  // AI Greeting
  useEffect(() => {
    if(!showForm){
      const getInitial = async () => {
        setIsLoading(true);
        try {
          const apiRes = await henceforthApi.SuperAdmin.getInitialMessage();

          const aiMessage: ChatMessage = {
            id: generateId(),
            content: apiRes?.data,
            sender: 'ai',
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error fetching initial message:', error);
        } finally {
          setIsLoading(false);
        }
      }

      getInitial()
    }
  },[showForm]);

  // Submit chat profile
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
    <>
      <Card className="w-full h-[calc(100vh-10vh)] flex flex-col rounded-none md:rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <CardTitle className="flex items-center text-base md:text-lg">
            <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" /> AI Chat
          </CardTitle>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={endChat}
              className="text-red-500 hover:bg-red-50 text-sm"
            >
              <span className='flex items-center'><Trash2 className="h-4 w-4 mr-2" /> <span>End Chat</span></span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-2 md:p-4 space-y-2 md:space-y-4 overflow-y-auto">
            {showForm ? (
              <div className='flex w-full justify-center items-center min-h-[calc(100vh-30vh)] p-4'>
                <Card className="w-full max-w-md p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                    <h2 className="text-lg md:text-xl font-semibold text-center">Get Started</h2>
                    <div>
                      <Label htmlFor="name" className="text-sm">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full text-sm"
                      />
                    </div>
                    <div className="flex gap-2 md:gap-4">
                      <div className="w-[30%]">
                        <Label htmlFor="countryCode" className="text-sm">Country Code</Label>
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value) => {
                            setFormData(prev => ({ ...prev, countryCode: value }));
                          }}
                        >
                          <SelectTrigger className="mt-1 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className='bg-white' placeholder='+91' defaultValue={"+91"}>
                            <SelectGroup className='max-h-[200px] overflow-y-scroll'>
                              {countryCode?.map((country: any) => (
                                <SelectItem
                                  className='hover:bg-gray-200 cursor-pointer text-sm'
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
                      <div className="w-[70%]">
                        <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                        <Input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="mt-1 block w-full text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full text-sm"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className='w-full bg-dynamic text-white text-sm md:text-base'
                    >
                      Start Chat
                    </Button>
                  </form>
                </Card>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 text-sm md:text-base">
                Start a conversation with AI
              </div>
            ) : (
              messages?.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                    } mb-2 md:mb-4`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] break-words p-2 md:p-3 rounded-lg text-sm md:text-base ${
                      message.sender === 'user'
                        ? 'bg-mediumDynamic text-white'
                        : message.sender === 'system'
                        ? 'bg-gray-200 text-black'
                        : message.sender === 'ai'
                        ? 'bg-gray-200 text-black'
                        : ''
                    }`}
                  >
                    {message?.content}
                    {message.sender === 'system' && (
                      <div className="flex justify-between mt-2 space-x-2">
                        <Button 
                          onClick={endChat} 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1 flex items-center text-white justify-center"
                        >
                          <X className="mr-2 h-4 w-4" /> End Chat
                        </Button>
                        <Button 
                          onClick={continueChat} 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 flex border-gray-400 items-center justify-center"
                        >
                          <Check className="mr-2 h-4 w-4" /> Continue Chat
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="typing-indicator  show" id="typingIndicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={scrollRef}></div>
          </ScrollArea>

          {/* Message Input Area */}
          <div className="p-2 md:p-4 border-t flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={showForm || isInputDisabled}
              placeholder="Type your message..."
              className="flex-1 text-sm md:text-base"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || showForm || isInputDisabled}
              className="bg-dynamic text-white p-2 md:p-3"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default function ChatPage() {
  return <AIChat />;
}
