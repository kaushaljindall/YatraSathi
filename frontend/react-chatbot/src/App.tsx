import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Experience } from "./avatar/Experience";
import { ChatOverlay } from "./components/ChatOverlay";
import { useChatStore } from "./store/useChatStore";
import { socketManager } from "./websocket/socketManager";

export default function App() {
  const {
    audioUrl,
    expression,
    expressionTrigger,
    animation,
    animationTrigger,
    setChatHidden
  } = useChatStore();

  useEffect(() => {
    socketManager.connect();
    
    // Iframe Bridge Listener
    const handleMessage = (event: MessageEvent) => {
      // Validate origin in production! (e.g. if (event.origin !== 'http://localhost:3000') return;)
      if (event.data?.type === 'TOGGLE_VISIBILITY') {
        setChatHidden(!event.data.data?.isOpen);
      } else if (event.data?.type === 'SET_CITY') {
        // Send a context update to backend
        socketManager.send(JSON.stringify({
          type: "system_prompt",
          text: `User is viewing travel plans for ${event.data.data}`
        }));
      }
    };
    
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      socketManager.disconnect();
    };
  }, [setChatHidden]);

  return (
    <>
      {/* 3D Scene */}
      <Canvas 
        shadows 
        camera={{ position: [0, 0.5, 2.5], fov: 30 }} 
        className="block bg-slate-900"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Experience 
            audioUrl={audioUrl} 
            expression={expression} 
            expressionTrigger={expressionTrigger}
            animation={animation}
            animationTrigger={animationTrigger}
          />
        </Suspense>
      </Canvas>

      {/* Chat UI Overlay */}
      <ChatOverlay />
    </>
  );
}
