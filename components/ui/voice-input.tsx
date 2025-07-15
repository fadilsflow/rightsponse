"use client";

import { useRef, useState } from "react";
import { Button } from "./button";
import { Mic, Loader2, StopCircleIcon } from "lucide-react";

// Define types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string; // <--- Tambahkan baris ini
  continuous: boolean;
  interimResults: boolean;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
  start: () => void;
  stop: () => void;
}

// Define the constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Extend the window interface
declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface VoiceInputProps {
  onTextReceived: (text: string) => void;
}

export function VoiceInput({ onTextReceived }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    setIsLoading(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "id-ID"; // Set bahasa Indonesia
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setIsLoading(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTextReceived(transcript);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsLoading(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsLoading(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <StopCircleIcon className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
