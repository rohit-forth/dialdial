import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "@/components/providers/Provider";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { createClient, ListenLiveClient } from "@deepgram/sdk";
import henceforthApi from "@/utils/henceforthApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import gladiatorIcon from "@/app/assets/images/hf_logo.png";
import { set } from "date-fns";
import { useRouter } from "next/navigation";

interface DeepgramCallProps {
  agentId: string;
  secretKey: string;
  initialMessage: string;
  chatId: string;
  setChatId: (chatId: string) => void;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  cleanup: () => Promise<void>;
  refs: {
    connection: ListenLiveClient | null;
    mediaRecorder: MediaRecorder | null;
    stream: MediaStream | null;
    isFinalTranscripts: string[];
    audio: HTMLAudioElement;
    isPlaying: boolean;
    chatId: string;
    scroll: HTMLDivElement | null;
  };
  // Consolidated state
  isCalling: boolean;
  isProcessing: boolean;
  isMicOn: boolean;
  isListening: boolean;
  isInitialMessagePlaying: boolean;
  profileSubmitted: boolean;
  callEndingInProgress: boolean;
  setDeepgramState: React.Dispatch<
    React.SetStateAction<{
      isCalling: boolean;
      isProcessing: boolean;
      isMicOn: boolean;
      isListening: boolean;
      isInitialMessagePlaying: boolean;
      profileSubmitted: boolean;
      callEndingInProgress: boolean;
    }>
  >;
}
const DeepgramCall = ({ ...props }: DeepgramCallProps) => {
  const {
    isCallActive,
    setIsCallActive,

    agentDetails,
    formData,
  } = useGlobalContext();
  const {
    agentId,
    secretKey,
    initialMessage,
    chatId = null,
    setChatId,
    messages,
    setMessages,
    cleanup,
    refs,
    ...state
  } = props;

  const isTranscriptionInitialized = useRef(false);

  const [isOutputPlaying, setIsOutputPlaying] = useState(false);

  useEffect(() => {
    const submitCallProfile = async () => {
      if (chatId && !state.profileSubmitted) {
        try {
          const payload = {
            email: formData.email,
            name: formData.name || null,
            phone_no: formData.phoneNumber || null,
            country_code: formData.countryCode || null,
            type: "VOICE_CHAT",
          };
          await henceforthApi.SuperAdmin.submitChatProfile(chatId, payload);
          state.setDeepgramState((prev) => ({
            ...prev,
            profileSubmitted: true,
          }));
        } catch (error) {
          console.error("Error submitting chat profile:", error);
        }
      }
    };

    submitCallProfile();
  }, [chatId]);

  useEffect(() => {
    // chatIdRef.current = chatId;
    if (refs && chatId) {
      refs.chatId = chatId;
    }
  }, [chatId]);

  const addMessage = (content: any, sender: any) => {
    setMessages((prevMessages: any) => [
      ...prevMessages,
      {
        id: Date.now(),
        content,
        sender,
      },
    ]);
  };

  useEffect(() => {
    if (refs.scroll) {
      refs.scroll.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const playInitialMessage = async () => {
    state.isMicOn = true;
    try {
      // setIsInitialMessagePlaying(true);
      // setIsMicOn(true);

      const response = await fetch(
        `https://api.deepgram.com/v1/speak?model=${agentDetails.agent_voice}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: "Token c7f2be50ae5262222eb302d1b47a8099e476b306",
          },
          body: JSON.stringify({
            text: initialMessage,
          }),
        }
      );

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // audioRef.current.src = audioUrl;
      // isPlayingRef.current = true;
      state.setDeepgramState((prev) => ({
        ...prev,
        isCalling: false,
        isMicOn: true,
      }));

      refs.audio.src = audioUrl;
      refs.isPlaying = true;
      // setIsCallActive(false);

      refs.audio.onended = () => {
        addMessage(initialMessage, "system");
        refs.isPlaying = false;
        state.setDeepgramState((prev) => ({
          ...prev,
          isInitialMessagePlaying: false,
          isMicOn: true,
        }));
        URL.revokeObjectURL(audioUrl);
        startTranscription();
      };
      if (isCallActive) {
        await refs.audio.play();
      }
    } catch (error) {
      console.error("Error playing initial message:", error);
      state.setDeepgramState((prev) => ({
        ...prev,
        isInitialMessagePlaying: false,
        isMicOn: false,
      }));
      startTranscription();
    }
  };

  useEffect(() => {
    return () => {
      isTranscriptionInitialized.current = false; // Reset flag
      stopTranscription(); // Force cleanup
    };
  }, []);
  const startTranscription = (() => {
    let lastCall = 0;
    const COOLDOWN = 1000;

    return async () => {
      const now = Date.now();
      if (now - lastCall < COOLDOWN) {
        console.log("Transcription start throttled");
        return;
      }
      lastCall = now;

      if (state.isProcessing || isTranscriptionInitialized.current) return;

      try {
        await cleanup();
        isTranscriptionInitialized.current = true;

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            noiseSuppression: true,
            echoCancellation: true,
            autoGainControl: true,
          },
        });
        refs.stream = stream;

        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        refs.mediaRecorder = mediaRecorder;

        // Initialize Deepgram client
        const deepgram = createClient(
          "c7f2be50ae5262222eb302d1b47a8099e476b306"
        );

        // Create live transcription connection
        const connection = deepgram.listen.live({
          model: "nova-2",
          language: "en-US",
          smart_format: true,
          interim_results: true,
          utterance_end_ms: 1000,
          vad_events: true,
          endpointing: 500,
        });
        refs.connection = connection;

        connection.on("open", () => {
          console.log("Deepgram connection opened");
          mediaRecorder.addEventListener("dataavailable", (event) => {
            if (
              connection &&
              event.data.size > 0 &&
              connection.getReadyState() === 1
            ) {
              connection.send(event.data);
            }
          });
          mediaRecorder.start(250);
        });

        connection.on("Results", (data) => {
          const receivedTranscript =
            data.channel?.alternatives[0]?.transcript || "";
          if (data.is_final) {
            refs.isFinalTranscripts.push(receivedTranscript);
          }
        });

        connection.on("UtteranceEnd", async () => {
          const fullUtterance = refs.isFinalTranscripts.join(" ");
          if (fullUtterance.trim()) {
            await sendFinalRequest(fullUtterance.trim());
            refs.isFinalTranscripts = [];
          }
        });

        connection.on("error", (error) => {
          console.error("Deepgram error:", error);
          stopTranscription();
        });

        connection.on("close", () => {
          console.log("Deepgram connection closed");
        });

        state.setDeepgramState((prev) => ({
          ...prev,
          isMicOn: true,
          isListening: true,
        }));
      } catch (error) {
        console.error("Error initializing microphone or Deepgram:", error);
        stopTranscription();
      }
    };
  })();

  const stopTranscription = async () => {
    try {
      if (refs.mediaRecorder && refs.mediaRecorder.state !== "inactive") {
        refs.mediaRecorder.stop();
      }

      if (refs.connection) {
        await refs.connection.finish();
      }

      if (refs.stream) {
        refs.stream.getTracks().forEach((track) => track.stop());
      }

      refs.mediaRecorder = null;
      refs.connection = null;
      refs.stream = null;
      refs.isFinalTranscripts = [];
      isTranscriptionInitialized.current = false;

      state.setDeepgramState((prev) => ({
        ...prev,
        isMicOn: false,
        isListening: false,
      }));
    } catch (error) {
      console.error("Error stopping transcription:", error);
    }
  };

  const toggleMic = async () => {
    if (!state.isMicOn) {
      await startTranscription();
    } else {
      await stopTranscription();
    }
  };
  const router = useRouter();
  const onEndCall = async () => {
    await cleanup();
    try {
      await henceforthApi.SuperAdmin.endChat(chatId);
      setMessages([]);
      setChatId("");
    } catch (err) {
      console.error(err);
    }
    setIsCallActive(false);
    state.isMicOn = false;
  };

  useEffect(() => {
    return () => {
      if (refs.isPlaying) {
        refs.audio.pause();
        refs.audio.currentTime = 0;
      }
      stopTranscription();
    };
  }, []);

  useEffect(() => {
    if (chatId && !refs.connection) {
      startTranscription();
      state.setDeepgramState((prev) => ({
        ...prev,
        isMicOn: true,
      }));
    }
  }, [chatId]);

  useEffect(() => {
    if (initialMessage && !chatId) {
      playInitialMessage();
    }
    return () => {
      cleanup();
    };
  }, []);

  const sendFinalRequest = async (transcript: string) => {
    if (state.isProcessing || !transcript) return;
    if (isOutputPlaying) return;

    try {
      setIsOutputPlaying(true);
      state.setDeepgramState((prev) => ({ ...prev, isProcessing: true }));
      addMessage(transcript, "user");

      if (refs.isPlaying) {
        refs.audio.pause();
        refs.audio.currentTime = 0;
        refs.isPlaying = false;
      }

      const requestBody = {
        query: transcript,
        prompt: agentDetails?.call_prompt,
        voice: agentDetails?.agent_voice,
        agent_id: agentId,
        secret_key: secretKey,
        ...(refs.chatId && { chat_id: refs.chatId }),
      };

      const response = await fetch(
        "https://dev.qixs.ai:3003/knowledge-base/landing/page/ai",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseBody = await response.json();
      const model_reply = responseBody?.model_text;

      if (responseBody?.chat_id && !refs.chatId) {
        const newChatId = String(responseBody.chat_id);
        setChatId(newChatId);
        refs.chatId = newChatId;
      }

      const audioBlob = new Blob([new Uint8Array(responseBody.data.data)], {
        type: "audio/wav",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      refs.audio.src = audioUrl;
      refs.isPlaying = true;

      refs.audio.onended = () => {
        refs.isPlaying = false;
        URL.revokeObjectURL(audioUrl);
      };

      addMessage(model_reply, "system");
      await refs.audio.play();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsOutputPlaying(false);
      state.setDeepgramState((prev) => ({ ...prev, isProcessing: false }));
    }
  };
  useEffect(() => {
    return () => {
      isTranscriptionInitialized.current = false;
    };
  }, []);

  return (
    <div className="flex h-full">
      <AnimatePresence>
        {state.isCalling ? (
          <motion.div
            className="flex items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center relative">
              <Phone className="w-8 h-8 text-white animate-pulse" />
              <div className="absolute w-full h-full rounded-full border-4 border-blue-400 animate-ripple" />
              <div className="absolute w-full h-full rounded-full border-4 border-blue-400 animate-ripple-delayed" />
            </div>
            <p className="mt-3 ml-4 text-lg font-medium text-gray-700">
              Connecting call...
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="flex w-full h-[calc(100vh-100px)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Speaker Section */}
            <div className="w-[300px] min-w-[300px] h-full flex flex-col items-center justify-center p-2 border-r">
              <div className="relative w-28 h-28 mb-8">
                <div
                  className={`absolute w-28 h-28 rounded-full flex items-center justify-center ${
                    state.isMicOn || state.isInitialMessagePlaying
                      ? "bg-blue-500"
                      : "bg-mediumDynamic"
                  } shadow-lg`}
                >
                  {(state.isMicOn || state.isInitialMessagePlaying) && (
                    <>
                      <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400 animate-ripple" />
                      <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400 animate-ripple-delayed" />
                    </>
                  )}

                  <div className="w-24 h-24 rounded-full flex items-center justify-center">
                    <img
                      src={henceforthApi?.FILES?.imageOriginal(
                        agentDetails?.agent_image,
                        ""
                      )}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <motion.button
                  className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
                  onClick={toggleMic}
                  whileTap={{ scale: 0.9 }}
                >
                  {state.isMicOn ? (
                    <Mic className="text-green-500 w-6 h-6" />
                  ) : (
                    <MicOff className="text-red-500 w-6 h-6" />
                  )}
                </motion.button>

                <motion.button
                  className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
                  onClick={onEndCall}
                  whileTap={{ scale: 0.9, rotate: -15 }}
                >
                  <PhoneOff className="text-red-500 w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 h-full overflow-hidden">
              <ScrollArea className="h-full px-4 py-2">
                <div className="space-y-12">
                  {messages?.map((message: any) => (
                    <div key={message.id} className="relative">
                      {message.sender === "system" && (
                        <div className="absolute -top-[53px] mt-4 mb-2 left-0">
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
                          className={`relative max-w-[80%] ${
                            message.sender === "user"
                              ? "bg-white border-r-4 border-gray-200 border border-r-mediumDynamic shadow rounded-[5px]"
                              : "bg-white border-l-4 border-gray-200 border border-l-mediumDynamic rounded-[5px] shadow-sm"
                          } px-4 py-3`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message?.content}
                          </p>
                        </div>
                      </div>
                      <div ref={(el) => (refs.scroll = el)} />
                    </div>
                  ))}
                  {state.isProcessing && (
                    <div className="relative">
                      <div className="absolute -top-7 left-0 mb-5">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img
                            src={henceforthApi?.FILES?.imageOriginal(
                              agentDetails?.agent_image,
                              ""
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
                </div>
              </ScrollArea>
            </div>
            <style jsx>{`
              @keyframes ripple {
                0% {
                  transform: scale(1);
                  opacity: 0.6;
                }
                100% {
                  transform: scale(1.5);
                  opacity: 0;
                }
              }

              .animate-ripple {
                animation: ripple 2s linear infinite;
              }

              .animate-ripple-delayed {
                animation: ripple 2s linear infinite 1s;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeepgramCall;
