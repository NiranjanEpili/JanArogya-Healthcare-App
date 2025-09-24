import React, { useEffect, useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';

type Language = 'en' | 'hi' | 'pa' | 'bn';

interface VoiceNavigationProps {
  isActive: boolean;
  language: Language;
  onCommand: (command: string) => void;
}

export function VoiceNavigation({ isActive, language, onCommand }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!isActive) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : language === 'bn' ? 'bn-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          setTranscript(transcript);
          onCommand(transcript);
          
          // Provide audio feedback
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              language === 'hi' 
                ? `आपका आदेश "${transcript}" सुन लिया गया`
                : `Command "${transcript}" received`
            );
            utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
            speechSynthesis.speak(utterance);
          }
        } else {
          setTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [isActive, language, onCommand]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          {isListening ? (
            <Mic className="h-5 w-5 animate-pulse" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          <span className="text-sm">
            {language === 'hi' 
              ? (isListening ? 'सुन रहा है...' : 'आवाज़ सहायक सक्रिय')
              : (isListening ? 'Listening...' : 'Voice Assistant Active')
            }
          </span>
        </div>
        
        {transcript && (
          <div className="text-xs bg-emerald-700 p-2 rounded mt-2">
            "{transcript}"
          </div>
        )}
        
        <div className="text-xs mt-2 opacity-80">
          {language === 'hi' 
            ? 'कहें: "होम", "मरीज़", "डॉक्टर", "आपातकाल"'
            : 'Say: "Home", "Patient", "Doctor", "Emergency"'
          }
        </div>
      </div>
    </div>
  );
}