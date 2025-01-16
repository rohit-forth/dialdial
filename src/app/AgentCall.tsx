import React, { useEffect, useState, useRef } from 'react';
import { useGlobalContext } from '@/components/providers/Provider';
import { motion } from 'framer-motion';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { createClient, ListenLiveClient } from '@deepgram/sdk';

const DeepgramCall = ({ agentId, secretKey }: { agentId: string; secretKey: string }) => {
  const [transcript, setTranscript] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const { setIsCallActive,agentDetails } = useGlobalContext();
  
  const connectionRef = useRef<ListenLiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isFinalTranscriptsRef = useRef<string[]>([]);
  const audioRef = useRef(new Audio());
  const isPlayingRef = useRef(false);

  const startTranscription = async () => {
    try {
      // First, clean up any existing connections
      await stopTranscription();

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

        // Send audio data to Deepgram
        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder?.start(250); // Send audio every 250ms
      });

      connection.on('Results', (data) => {
        if (!isMicOn) return; // Don't process results if mic is off
        
        const receivedTranscript = data.channel?.alternatives[0]?.transcript || '';
        
        if (data.is_final) {
          isFinalTranscriptsRef.current.push(receivedTranscript);
          setTranscript(prev => prev + ' ' + receivedTranscript);
        }
      });

      connection.on('UtteranceEnd', () => {
        if (!isMicOn) return; // Don't process utterance if mic is off
        
        const fullUtterance = isFinalTranscriptsRef.current.join(' ').trim();
        if (fullUtterance) {
          sendFinalRequest(fullUtterance);
          isFinalTranscriptsRef.current = [];
        }
      });

      connection.on('error', (error) => {
        console.error('Deepgram error:', error);
        setIsListening(false);
      });

      connection.on('close', () => {
        console.log('Deepgram connection closed');
        setIsListening(false);
      });

    } catch (error) {
      console.error('Error starting transcription:', error);
      setIsListening(false);
    }
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

  const sendFinalRequest = async (transcript: any) => {
    try {
      // If audio is playing and we get new input, stop current playback
      if (isPlayingRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }

      const requestBody = {
        query: transcript,
        prompt: agentDetails?.agent_prompt,
        voice: agentDetails?.agent_voice,
        chat_id: `chat_${Date.now()}_${Math.floor(Math.random() * 10000000)}`,
        agent_id: agentId,
        secret_key: secretKey,
      };

      const response = await fetch('https://dev.qixs.ai:3003/knowledge-base/landing/page/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioRef.current.src = audioUrl;
      isPlayingRef.current = true;
      
      audioRef.current.onended = () => {
        isPlayingRef.current = false;
      };
      
      await audioRef.current.play();

    } catch (error) {
      console.error('Error sending final request:', error);
      isPlayingRef.current = false;
    }
  };

  const toggleMic = async () => {
    if (isListening) {
      await stopTranscription();
      if (isPlayingRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlayingRef.current = false;
      }
    } else {
      // setTranscript(''); // Clear transcript when starting new session
      await startTranscription();
    }
    setIsMicOn(!isMicOn);
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
    startTranscription();
    return () => {
      if (isPlayingRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopTranscription();
    };
  }, []);
  return (
    <motion.div
      className="flex flex-col mt-auto mb-auto justify-center items-center gap-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* <h3 className="text-lg font-semibold">Transcript:</h3>
      <div className="mt-2 p-4 bg-gray-100 rounded min-h-[100px] whitespace-pre-wrap w-full max-w-2xl">
        {transcript || 'Start speaking...'}
      </div> */}

      <div 
        className="relative w-28 h-28 flex items-center justify-center"
        onClick={toggleMic}
      >
        <div
          className={`absolute w-28 h-28 rounded-full flex items-center justify-center ${
            isMicOn ? "bg-dynamic" : "bg-red-500"
          } shadow-lg`}
        >
          {isMicOn && (
            <>
              <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400 animate-ripple" />
              <div className="absolute w-28 h-28 rounded-full border-4 border-blue-400 animate-ripple-delayed" />
            </>
          )}
          
          {isMicOn ? (
            <Mic className="text-white w-12 h-12 relative z-10" />
          ) : (
            <MicOff className="text-white w-12 h-12 relative z-10" />
          )}
        </div>
      </div>

      <div className="flex gap-10">
        <motion.button
          className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none"
          onClick={toggleMic}
          whileTap={{ scale: 0.9 }}
        >
          {isMicOn ? (
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
          <PhoneOff className="text-red-500 w-6 h-5" />
        </motion.button>
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
  );
};

export default DeepgramCall;