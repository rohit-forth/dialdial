import React, { useEffect, useState, useRef } from 'react';
import { useGlobalContext } from '@/components/providers/Provider';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { createClient, ListenLiveClient } from '@deepgram/sdk';
import henceforthApi from '@/utils/henceforthApi';

import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { add } from 'date-fns';

const DeepgramCall = ({ agentId, secretKey, initialMessage }: { agentId: string; secretKey: string; initialMessage: string }) => {
  const [transcript, setTranscript] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInitialMessagePlaying, setIsInitialMessagePlaying] = useState(false);
  const { isCallActive, setIsCallActive, companyDetails, agentDetails } = useGlobalContext();

  const connectionRef = useRef<ListenLiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isFinalTranscriptsRef = useRef<string[]>([]);
  const audioRef = useRef(new Audio());
  const isPlayingRef = useRef(false);
  const [chatId, setChatId] = useState('');
  const chatIdRef = useRef(''); //
  interface Message {
    id: number;
    content: any;
    sender: any;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [isCalling, setIsCalling] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  const addMessage = (content: any, sender: any) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      content,
      sender
    }]);
  };

  useEffect(()=>{
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },[messages]);


  console.log(chatId, "chatId23");

  const playInitialMessage = async () => {
    try {
      setIsInitialMessagePlaying(true);
      setIsMicOn(true);

      const response = await fetch(`https://api.deepgram.com/v1/speak?model=${agentDetails.agent_voice}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token c7f2be50ae5262222eb302d1b47a8099e476b306'
        },
        body: JSON.stringify({
          text: initialMessage
        })
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      isPlayingRef.current = true;
      setIsCalling(false);

      audioRef.current.onended = () => {
        isPlayingRef.current = false;
        setIsInitialMessagePlaying(false);
        URL.revokeObjectURL(audioUrl);
        addMessage(initialMessage, 'system');
        startTranscription();
      };
      if (isCallActive) {

        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing initial message:', error);
      setIsInitialMessagePlaying(false);
      setIsMicOn(false);

      startTranscription();
    }
  };


  const startTranscription = () => {
    const initializeTranscription = async () => {
      try {
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            noiseSuppression: true,
            echoCancellation: true,
            autoGainControl: true,
          },
        });
        streamRef.current = stream;

        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        // Initialize Deepgram client
        const deepgram = createClient('c7f2be50ae5262222eb302d1b47a8099e476b306');

        // Create live transcription connection
        const connection = deepgram.listen.live({
          model: 'nova-2',
          language: 'en-US',
          smart_format: true,
          interim_results: true,
          utterance_end_ms: 1000,
          vad_events: true,
          endpointing: 500,
        });
        connectionRef.current = connection;

        // Set up connection event handlers
        connection.on('open', () => {
          console.log('Deepgram connection opened');
          setIsListening(true);
          setIsMicOn(true);

          mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && connection.getReadyState() === 1) {
              connection.send(event.data);
            }
          });

          mediaRecorder.start(250); // Send audio every 250ms
        });

        connection.on('Results', (data) => {
          const receivedTranscript = data.channel?.alternatives[0]?.transcript || '';

          if (data.is_final) {
            isFinalTranscriptsRef.current.push(receivedTranscript);
            console.log(`Final Transcript: ${isFinalTranscriptsRef.current.join(" ")}`);
          } else {
            console.log(`Interim Transcript: ${receivedTranscript}`);
          }
        });

        connection.on('UtteranceEnd', async () => {
          const fullUtterance = isFinalTranscriptsRef.current.join(' ');
          console.log(`Utterance End: ${fullUtterance}`);
          if (fullUtterance.trim()) {
            await sendFinalRequest(fullUtterance.trim());
            isFinalTranscriptsRef.current = [];
          }
        });

        connection.on('error', (error) => {
          console.error('Deepgram error:', error);
        });

        connection.on('close', () => {
          console.log('Deepgram connection closed');
        });

      } catch (error) {
        console.error('Error initializing microphone or Deepgram:', error);
        setIsMicOn(false);
        setIsListening(false);
      }
    };

    initializeTranscription();
  };

  const stopTranscription = async () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }

      if (connectionRef.current) {
        connectionRef.current.finish();
        connectionRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setIsListening(false);
      isFinalTranscriptsRef.current = [];
    } catch (error) {
      console.error('Error stopping transcription:', error);
    }
  };

  const toggleMic = async () => {
    if (isInitialMessagePlaying) return;

    if (isListening) {
      await stopTranscription();
      if (isPlayingRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }
      setIsMicOn(false);
    } else {
      startTranscription();
    }
  };

  const onEndCall = async () => {
    if (isPlayingRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
    await stopTranscription();
    setIsCallActive(false);
    setIsMicOn(false);
  };

  useEffect(() => {
    if (initialMessage) {
      playInitialMessage();
    }
    return () => {
      if (isPlayingRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopTranscription();
    };
  }, []);



  const sendFinalRequest = async (transcript: any) => {

    if (isProcessing || !transcript) {
      return
    }
    addMessage(transcript, 'user');
    try {
      if (isPlayingRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }

      const requestBody: {
        query: any;
        prompt: any;
        voice: any;
        agent_id: string;
        secret_key: string;
        chat_id?: string;
      } = {
        query: transcript,
        prompt: agentDetails?.agent_prompt,
        voice: agentDetails?.agent_voice,
        agent_id: agentId,
        secret_key: secretKey,
      };

      // Use the ref instead of the state directly
      console.log(chatIdRef.current, "beforechatIdIf");
      if (chatIdRef.current) {
        requestBody.chat_id = chatIdRef.current;
      }
      console.log(requestBody, "requestBody with chatId");

      const response = await fetch('https://dev.qixs.ai:3003/knowledge-base/landing/page/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(requestBody),
      });

      const responseBody = await response.json();
      console.log(responseBody, "responseBody");
      const model_reply=responseBody?.model_text;

      if (responseBody && responseBody.chat_id && !chatIdRef.current) {
        const newChatId = String(responseBody.chat_id);
        setChatId(newChatId);
        chatIdRef.current = newChatId; // Update ref immediately
        console.log('Setting chat_id to:', newChatId);
      }

      const audioBlob = new Blob([new Uint8Array(responseBody.data.data)], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      isPlayingRef.current = true;

      audioRef.current.onended = () => {
        isPlayingRef.current = false;
        URL.revokeObjectURL(audioUrl);
      };
      addMessage(model_reply, 'system');
        
      if (isCallActive) {

        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error sending final request:', error);
      isPlayingRef.current = false;
    }
  };



return (
  <div className="flex h-full">
    <AnimatePresence>
      {isCalling ? (
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
          <p className="mt-3 ml-4 text-lg font-medium text-gray-700">Connecting call...</p>
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
          <div className="w-[300px] min-w-[300px] h-full flex flex-col items-center justify-center p-4 border-r">
            <div className="relative w-28 h-28 mb-8">
              <div className={`absolute w-28 h-28 rounded-full flex items-center justify-center ${
                (isMicOn || isInitialMessagePlaying) ? "bg-blue-500" : "bg-mediumDynamic"
              } shadow-lg`}>
                {(isMicOn || isInitialMessagePlaying) && (
                  <>
                    <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400 animate-ripple" />
                    <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400 animate-ripple-delayed" />
                  </>
                )}
                {(isMicOn || isInitialMessagePlaying) ? (
                  <Phone className="text-white w-12 h-12 relative z-10" />
                ) : (
                  <PhoneOff className="text-white w-12 h-12 relative z-10" />
                )}
              </div>
            </div>

            <div className="flex gap-6">
              <motion.button
                className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
              >
                {(isMicOn || isInitialMessagePlaying) ? (
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
            <ScrollArea className="h-full px-4 py-6">
              <div className="space-y-8">
                {messages?.map((message) => (
                  <div key={message.id} className="relative">
                    {message.sender === 'system' && (
                      <div className="absolute -top-10 left-0">
                        <div className="w-8 h-8 border-2 rounded-lg overflow-hidden">
                          <img
                            src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo, "")}
                            alt="AI"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`relative max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-white border-r-4 border-gray-200 border border-r-mediumDynamic shadow rounded-[5px]'
                          : 'bg-white border-l-4 border-gray-200 border border-l-mediumDynamic rounded-[5px] shadow-sm'
                      } px-4 py-3`}>
                        <p className="text-sm leading-relaxed">{message?.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="relative">
                    <div className="absolute -top-7 left-0 mb-5">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img
                          src={henceforthApi?.FILES?.imageOriginal(companyDetails?.company_logo, "")}
                          alt="AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-100 shadow-sm rounded-3xl mt-2 px-4 py-3 inline-block">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                {/* <div ref={scrollRef} /> */}
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