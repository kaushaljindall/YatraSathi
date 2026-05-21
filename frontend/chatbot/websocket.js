// websocket.js
export class ZivaWebSocket {
    constructor(url, handlers) {
        this.url = url;
        this.handlers = handlers;
        this.ws = null;
        this.reconnectAttempts = 0;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            if(this.handlers.onConnect) this.handlers.onConnect();
        };

        this.ws.onmessage = (event) => {
            try {
                if(event.data instanceof Blob) {
                    if(this.handlers.onAudioData) this.handlers.onAudioData(event.data);
                } else {
                    const data = JSON.parse(event.data);
                    if(this.handlers.onMessage) this.handlers.onMessage(data);
                }
            } catch (err) {
                console.error("WS parse error", err);
            }
        };

        this.ws.onerror = (err) => {
            console.error("WS error:", err);
            if(this.handlers.onError) this.handlers.onError(err);
        };

        this.ws.onclose = () => {
            if(this.handlers.onDisconnect) this.handlers.onDisconnect();
            // Retry
            if(this.reconnectAttempts < 5) {
                setTimeout(() => this.connect(), 2000 * Math.pow(2, this.reconnectAttempts));
                this.reconnectAttempts++;
            }
        };
    }

    sendAudioChunk(chunk) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(chunk);
        }
    }

    sendData(data) {
        if(this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    close() {
        if(this.ws) this.ws.close();
    }
}
