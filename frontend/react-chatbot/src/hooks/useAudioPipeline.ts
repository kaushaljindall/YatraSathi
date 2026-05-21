import { useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { socketManager } from '../websocket/socketManager';

export function useAudioPipeline() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  
  const startRecording = async () => {
    const store = useChatStore.getState();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && socketManager.isOpen()) {
          const arrayBuffer = await event.data.arrayBuffer();
          socketManager.send(arrayBuffer);
        }
      };

      mediaRecorder.current.onstop = () => {
        socketManager.send(JSON.stringify({ type: "stop_recording" }));
        stream.getTracks().forEach(track => track.stop());
      };

      socketManager.send(JSON.stringify({
        type: "config",
        source_lang: store.sourceLang,
        target_lang: store.targetLang
      }));

      mediaRecorder.current.start(250);
      store.setIsRecording(true);
      store.setStatus("Listening...");
      store.setUserText("...");
      store.setTranslationText("Listening...");
      store.setAnimation("LookAround");
      store.triggerAnimation();
      store.setAudioUrl(null);
    } catch (err) {
      console.error("Mic access denied", err);
      store.setStatus("Mic access denied");
    }
  };

  const stopRecording = () => {
    const store = useChatStore.getState();
    if (mediaRecorder.current && store.isRecording) {
      mediaRecorder.current.stop();
      store.setIsRecording(false);
      store.setStatus("Processing...");
      store.setAnimation("Thinking");
      store.triggerAnimation();
    }
  };

  const toggleRecording = () => {
    if (useChatStore.getState().isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return { startRecording, stopRecording, toggleRecording };
}
