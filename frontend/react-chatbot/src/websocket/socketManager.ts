import { useChatStore } from '../store/useChatStore';

export class SocketManager {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    const store = useChatStore.getState();

    this.ws.onopen = () => store.setStatus("Ready to talk");
    this.ws.onclose = () => store.setStatus("Disconnected");
    this.ws.onerror = () => store.setStatus("Connection Error");

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "status") {
        store.setStatus(data.message);
      } else if (data.type === "stt") {
        store.setUserText(`You: "${data.text}"`);
      } else if (data.type === "translation") {
        store.setTranslationText(data.text);
      } else if (data.type === "audio_url") {
        const url = data.url.startsWith("http") ? data.url : `https://ikaushaljindal-yatrasaathi-backend.hf.space${data.url}`;
        store.setAudioUrl(url);
        store.setStatus("Tap mic to speak");
      } else if (data.type === "a2f_stream") {
        const url = data.url.startsWith("http") ? data.url : `https://ikaushaljindal-yatrasaathi-backend.hf.space${data.url}`;
        store.setA2fFrames(data.frames || []);
        store.setAudioUrl(url);
        store.setStatus("Tap mic to speak");
      } else if (data.type === "avatar_state") {
        store.setAnimation(
          data.state === "talking" ? "Talking" : 
          data.state === "thinking" ? "Thinking" : 
          data.state === "listening" ? "LookAround" : "Idle"
        );
        store.triggerAnimation();
      } else if (data.type === "error") {
        store.setStatus(`Error: ${data.message}`);
        store.setAnimation("Idle");
      }
    };
  }

  disconnect() {
    this.ws?.close();
  }

  send(data: string | ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  isOpen() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const socketManager = new SocketManager("wss://ikaushaljindal-yatrasaathi-backend.hf.space/ws/ziva/audio");
