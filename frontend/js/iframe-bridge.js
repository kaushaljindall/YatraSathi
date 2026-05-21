// iframe-bridge.js
export function sendToZiva(type, data) {
    const iframe = document.getElementById('chat-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type, data }, 'http://localhost:5173');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('message', (event) => {
        if (event.origin !== 'http://localhost:5173') return;
        
        // Handle messages from Ziva
        console.log("Message from Ziva:", event.data);
    });
});
