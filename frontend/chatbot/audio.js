// audio.js
export class AudioRecorder {
    constructor(onChunk, onStop) {
        this.mediaRecorder = null;
        this.onChunk = onChunk;
        this.onStopCallback = onStop;
        this.isRecording = false;
        this.stream = null;
    }

    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'audio/webm' });
            
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0 && this.onChunk) {
                    this.onChunk(e.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                if(this.onStopCallback) this.onStopCallback();
                this.stream.getTracks().forEach(t => t.stop());
            };
            
            // Collect 100ms chunks for low latency
            this.mediaRecorder.start(100);
            this.isRecording = true;
        } catch (err) {
            console.error("Error accessing microphone", err);
            throw err;
        }
    }

    stop() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
    }
}
