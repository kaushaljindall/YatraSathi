class ZivaWebSocket {
    constructor(url, callbacks) {
        this.url = url;
        this.callbacks = callbacks;
        this.ws = null;
        this.mediaRecorder = null;
        this.isRecording = false;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            console.log('Connected to Ziva WebSocket');
            if(this.callbacks.onConnect) this.callbacks.onConnect();
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.callbacks[data.type]) {
                this.callbacks[data.type](data.payload);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected. Reconnecting in 3s...');
            setTimeout(() => this.connect(), 3000);
        };
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(event.data);
                }
            };
            
            // Chunk every 1000ms for demo, ideally 250ms for ultra low latency VAD
            this.mediaRecorder.start(1000);
            this.isRecording = true;
            if(this.callbacks.onRecordingStart) this.callbacks.onRecordingStart();
        } catch (err) {
            console.error("Microphone access denied or error:", err);
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            if(this.callbacks.onRecordingStop) this.callbacks.onRecordingStop();
        }
    }
}

export default ZivaWebSocket;
