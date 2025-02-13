import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, X, Check } from "lucide-react";
import { LiveClient as ListenLiveClient } from "@deepgram/sdk";
import { ScrollArea } from "@/components/ui/scroll-area";

import henceforthApi from "@/utils/henceforthApi";

import { Button } from "@/components/ui/button";

import { useGlobalContext } from "@/components/providers/Provider";
import gladiatorIcon from "@/app/assets/images/hf_logo.png";
import { useRouter, useSearchParams } from "next/navigation";
import DeepgramCall from "./AgentCall";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai" | "system" | "inactivity";
  timestamp: number;
  color?: boolean;
  actions?: "end_chat" | "continue_chat" | null;
}

const AIChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const {
    messages,
    setMessages,

    isCallActive,

    panelSwitch,
    decodedToken,
    setDecodedToken,
    agentDetails,
    showForm,
    setShowForm,
    chatId,
    setChatId,
    formData,
    setFormData,
  } = useGlobalContext();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [countdownTime, setCountdownTime] = useState<number | null>(null);

  useEffect(() => {
    const systemMessage = messages.find(
      (msg) => msg.sender === "system" && msg.actions === "end_chat"
    );

    if (systemMessage && countdownTime === null) {
      setCountdownTime(300); // 5 minutes in seconds
    }
  }, [messages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdownTime !== null && countdownTime > 0) {
      timer = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            if (prev === 0) endChat(); // Only end chat if we've reached 0
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

  const resetInactivityTimer = useCallback(() => {
    if (!showForm) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        const existingSystemMessage = messages.find(
          (msg) => msg.sender === "system" && msg.actions === "end_chat"
        );

        if (!existingSystemMessage) {
          const inactivityMessage: ChatMessage = {
            id: `msg_inactivity_${Date.now()}`,
            content: "Would you like to end this conversation?",
            sender: "system",
            timestamp: Date.now(),
            actions: "end_chat",
          };

          setMessages((prev) => [...prev, inactivityMessage]);
          setIsInputDisabled(true);
        }
      }, 300000);

      lastActivityTimeRef.current = Date.now();
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [showForm, messages]);

  useEffect(() => {
    const trackActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener("mousemove", trackActivity);
    window.addEventListener("keydown", trackActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", trackActivity);
      window.removeEventListener("keydown", trackActivity);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setShowForm(false);
  //   setIsInputDisabled(false);
  // };

  const continueChat = () => {
    setMessages((prev) => prev.filter((msg) => msg.sender !== "system"));
    setIsInputDisabled(false);
    setCountdownTime(null);
    resetInactivityTimer();
  };
  const router = useRouter();

  // Modify your endChat function to reset the countdown
  const endChat = async () => {
    if (chatId) {
      try {
        await henceforthApi?.SuperAdmin.endChat(chatId);
      } catch (error) {
        console.error("Error ending chat:", error);
      }
    }
    setShowForm(true);
    setMessages([]);
    setChatId(null);
    setIsInputDisabled(false);
    setCountdownTime(null);
    const link = document.createElement("a");
    link.href = "/form";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: trimmedMessage,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let aiResponse;
      if (chatId) {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          text: trimmedMessage,
          chat_id: chatId,
          agent_id: decodedToken?.agent_id,
          secret_key: agentDetails?.secret_key,
        });
      } else {
        aiResponse = await henceforthApi?.SuperAdmin.sendMessage({
          text: trimmedMessage,
          agent_id: decodedToken?.agent_id,
          secret_key: agentDetails?.secret_key,
        });
        setChatId(aiResponse?.data?.chat_id);
      }

      const aiMessage: ChatMessage = {
        id: generateId(),
        content: aiResponse?.data?.ai_response,
        sender: "ai",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error in AI response:", error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: error?.response?.body?.message,
        sender: "ai",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && !isInputDisabled) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  let timeout: NodeJS.Timeout | null = null;
  useEffect(() => {
    timeout = setTimeout(() => {
      scrollRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      try {
        const aiMessage: ChatMessage = {
          id: generateId(),
          content: agentDetails?.chat_first_message,
          sender: "ai",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error fetching initial message:", error);
      }
    };

    if (!showForm && decodedToken?.agent_id && messages?.length === 0) {
      const timeoutId = setTimeout(sendInitialMessage, 1000);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      // localStorage.removeItem("token");
    };
  }, [
    showForm,
    decodedToken?.agent_id,
    messages?.length,
    agentDetails?.chat_first_message,
  ]);

  useEffect(() => {
    const payload = {
      email: formData.email,
      name: formData.name || null,
      phone_no: formData.phoneNumber || null,
      country_code: formData.countryCode || null,
      type: "CHAT",
    };
    if (chatId) {
      try {
        henceforthApi.SuperAdmin.submitChatProfile(chatId, payload);
      } catch (error) {
        console.error("Error submitting chat profile:", error);
      }
    }
  }, [chatId]);

  //here is all states of deepgram call

  const [callId, setCallId] = useState("");

  const [callMessages, setCallMessages] = useState<any[]>([]);

  const [deepgramState, setDeepgramState] = useState({
    isCalling: true,
    isProcessing: false,
    isMicOn: false,
    isListening: false,
    isInitialMessagePlaying: false,
    profileSubmitted: false,
    callEndingInProgress: false,
  });

  const deepgramRefs = useRef({
    connection: null as ListenLiveClient | null,
    mediaRecorder: null as MediaRecorder | null,
    stream: null as MediaStream | null,
    isFinalTranscripts: [] as string[],
    audio: new Audio(),
    isPlaying: false,
    chatId: "",
    scroll: null as HTMLDivElement | null,
  });

  const cleanupDeepgramResources = useCallback(async () => {
    const refs = deepgramRefs.current;

    if (refs.isPlaying) {
      refs.audio.pause();
      refs.audio.currentTime = 0;
      refs.isPlaying = false;
    }

    if (refs.mediaRecorder && refs.mediaRecorder.state !== "inactive") {
      refs.mediaRecorder.stop();
    }

    if (refs.connection) {
      await refs.connection.finish();
    }

    if (refs.stream) {
      refs.stream.getTracks().forEach((track) => track.stop());
    }

    // Reset refs
    refs.connection = null;
    refs.mediaRecorder = null;
    refs.stream = null;
    refs.isFinalTranscripts = [];

    // Reset state
    setDeepgramState((prev) => ({
      ...prev,
      isListening: false,
      isMicOn: false,
    }));
  }, []);

  useEffect(() => {
    return () => {
      cleanupDeepgramResources();
    };
  }, [cleanupDeepgramResources]);

  useEffect(() => {
    if (!panelSwitch) {
      cleanupDeepgramResources();
    }
  }, [panelSwitch, cleanupDeepgramResources]);

  useEffect(() => {
    if (!isCallActive) {
      cleanupDeepgramResources();
    }
  }, [isCallActive, cleanupDeepgramResources]);

  return (
    <div className="grid grid-cols-1 grid-flow-row col-span-1  relative ">
      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {isCallActive && panelSwitch ? (
          <DeepgramCall
            agentId={decodedToken?.agent_id}
            secretKey={agentDetails?.secret_key}
            initialMessage={agentDetails?.call_first_message}
            chatId={callId}
            setChatId={setCallId}
            messages={callMessages}
            setMessages={setCallMessages}
            // Pass consolidated state and state updater
            {...deepgramState}
            setDeepgramState={setDeepgramState}
            // Pass refs object
            refs={deepgramRefs.current}
            // Pass cleanup function
            cleanup={cleanupDeepgramResources}
          />
        ) : (
          <>
            <div className="flex-1 relative right-1 h-full w-full mx-auto overflow-hidden  ">
              <ScrollArea className="h-full flex items-center">
                <div className="px-4 py-6 md:px-7 ">
                  {
                    <div className="flex-1 flex flex-col mx-auto ">
                      <ScrollArea className="flex-1 px-4 py-4">
                        <div className="space-y-16 mt-10">
                          {messages?.map((message) => (
                            <div key={message.id} className="relative ">
                              {message.sender !== "user" && (
                                <div className="absolute -top-10 left-0 ">
                                  <div className="w-8 h-8 border-2 rounded-lg overflow-hidden">
                                    <img
                                      src={henceforthApi?.FILES?.imageOriginal(
                                        agentDetails?.agent_image,
                                        gladiatorIcon.src
                                      )}
                                      alt="AI"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}

                              <div
                                className={`flex ${
                                  message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`relative max-w-[80%]
                                    
                                    ${
                                      message.sender === "user"
                                        ? "bg-white border-r-4 border-gray-200 border border-r-dynamic shadow rounded-[5px]"
                                        : "bg-white border-l-4 border-gray-200 border border-l-dynamic rounded-[5px] shadow-sm"
                                    } px-4 py-3 `}
                                >
                                  <p
                                    className={`text-sm leading-relaxed ${
                                      message.content?.includes("subscription")
                                        ? "text-red-500"
                                        : ""
                                    }`}
                                  >
                                    {message.content}
                                  </p>

                                  {message.sender === "system" && (
                                    <div className="flex gap-2 mt-3">
                                      <Button
                                        onClick={() => {
                                          endChat();
                                          setCountdownTime(null);
                                        }}
                                        size="sm"
                                        className="bg-dynamic text-white text-xs"
                                      >
                                        <X className="h-3 w-3 mr-1" /> End Chat
                                        <span className="ml-3">
                                          {countdownTime
                                            ? `${Math.floor(
                                                countdownTime / 60
                                              )}:${(countdownTime % 60)
                                                .toString()
                                                .padStart(2, "0")}`
                                            : "0:00"}
                                        </span>
                                      </Button>
                                      <Button
                                        onClick={continueChat}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs relative"
                                      >
                                        <Check className="h-3 w-3 mr-1" />{" "}
                                        Continue Chat
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
                                    src={henceforthApi?.FILES?.imageOriginal(
                                      agentDetails?.agent_image,
                                      gladiatorIcon.src
                                    )}
                                    alt="AI"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="bg-gray-200 shadow-sm rounded-3xl rounded-tl-none mt-2 px-4 py-3 inline-block">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <span>Connecting</span>
                                  <span className="animate-pulse">.</span>
                                  <span className="animate-pulse delay-100">
                                    .
                                  </span>
                                  <span className="animate-pulse delay-200">
                                    .
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {isLoading && (
                            <div className="relative">
                              <div className="absolute -top-7 left-0 mb-5">
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                  <img
                                    src={henceforthApi?.FILES?.imageOriginal(
                                      agentDetails?.agent_image,
                                      gladiatorIcon.src
                                    )}
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
                  }
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
                  disabled={
                    !inputMessage.trim() || isLoading || isInputDisabled
                  }
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
        )}
      </div>
    </div>
  );
};

export default AIChat;
