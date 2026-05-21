// iframe-bridge.js
export function sendToZiva(type, data) {
    const iframe = document.getElementById('chat-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type, data }, '*');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('message', (event) => {
        // Handle messages from Ziva
        console.log("Message from Ziva:", event.data);
    });
});
