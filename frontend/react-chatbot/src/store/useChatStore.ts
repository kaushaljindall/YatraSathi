import { create } from 'zustand';

interface ChatState {
  status: string;
  userText: string;
  translationText: string;
  isRecording: boolean;
  sourceLang: string;
  targetLang: string;
  chatHidden: boolean;
  audioUrl: string | null;
  expression: string;
  expressionTrigger: number;
  animation: string;
  animationTrigger: number;
  
  setStatus: (status: string) => void;
  setUserText: (text: string) => void;
  setTranslationText: (text: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setChatHidden: (hidden: boolean) => void;
  setAudioUrl: (url: string | null) => void;
  setExpression: (exp: string) => void;
  setAnimation: (anim: string) => void;
  triggerAnimation: () => void;
  triggerExpression: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  status: "Connecting...",
  userText: "",
  translationText: "",
  isRecording: false,
  sourceLang: "auto",
  targetLang: "en",
  chatHidden: false,
  audioUrl: null,
  expression: "default",
  expressionTrigger: 0,
  animation: "Idle",
  animationTrigger: 0,

  setStatus: (status) => set({ status }),
  setUserText: (userText) => set({ userText }),
  setTranslationText: (translationText) => set({ translationText }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setSourceLang: (sourceLang) => set({ sourceLang }),
  setTargetLang: (targetLang) => set({ targetLang }),
  setChatHidden: (chatHidden) => set({ chatHidden }),
  setAudioUrl: (audioUrl) => set({ audioUrl }),
  setExpression: (expression) => set({ expression }),
  setAnimation: (animation) => set({ animation }),
  triggerAnimation: () => set((state) => ({ animationTrigger: state.animationTrigger + 1 })),
  triggerExpression: () => set((state) => ({ expressionTrigger: state.expressionTrigger + 1 })),
}));
