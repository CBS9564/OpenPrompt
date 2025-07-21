import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
}

export const useSpeechRecognition = ({ onResult }: UseSpeechRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // You might want to make this configurable

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, [onResult]);

  const startRecognition = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  }, [isRecording]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  const toggleRecognition = useCallback(() => {
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isRecording, startRecognition, stopRecognition]);

  return { isRecording, toggleRecognition, startRecognition, stopRecognition };
};
