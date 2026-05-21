// ziva.js
import { ZivaWebSocket } from './websocket.js';
import { AudioRecorder } from './audio.js';
import { WaveformVisualizer } from './waveform.js';
import { AvatarManager } from './avatar.js';

export class ZivaManager {
    constructor() {
        this.statusText = document.getElementById('zivaStatusText');
        this.micBtn = document.getElementById('zivaMicBtn');
        this.translationText = document.getElementById('zivaTranslationText');
        this.userText = document.getElementById('zivaUserText');
        this.langSelect = document.getElementById('zivaLangSelect');
        this.audioPlayer = document.getElementById('zivaAudioPlayer');
        
        this.waveform = new WaveformVisualizer('zivaWaveform');
        this.avatar = null;
        
        // Use timeout to let DOM render before initializing 3D
        setTimeout(() => {
            this.avatar = new AvatarManager('zivaAvatarContainer');
        }, 500);
        
        this.recorder = null;
        this.ws = null;

        this.init();
    }

    init() {
        this.micBtn.addEventListener('click', () => this.toggleRecording());
        
        // Listen for audio player end to return avatar to idle
        if(this.audioPlayer) {
            this.audioPlayer.addEventListener('ended', () => {
                if(this.avatar) this.avatar.playAnimation('idle');
            });
        }
        
        // Initialize WebSocket
        this.ws = new ZivaWebSocket('ws://localhost:8000/ws/ziva/audio', {
            onConnect: () => {
                this.updateStatus("Ready to talk");
            },
            onDisconnect: () => {
                this.updateStatus("Disconnected");
            },
            onMessage: (data) => {
                if(data.type === 'status') {
                    this.updateStatus(data.message);
                } else if(data.type === 'stt') {
                    this.userText.innerText = `You: "${data.text}"`;
                } else if(data.type === 'translation') {
                    this.translationText.innerText = data.text;
                } else if(data.type === 'audio_url') {
                    // Play TTS audio and animate avatar
                    if(this.audioPlayer) {
                        this.audioPlayer.src = data.url;
                        this.audioPlayer.play().then(() => {
                            if(this.avatar) this.avatar.playAnimation('talking');
                        }).catch(e => console.error("Audio play failed:", e));
                    }
                    this.updateStatus("Tap mic to speak");
                } else if(data.type === 'avatar_state') {
                    if(this.avatar) this.avatar.playAnimation(data.state);
                }
            },
            onError: (err) => {
                console.error("Ziva WS Error", err);
                this.updateStatus("Connection Error");
            }
        });
        
        this.ws.connect();
    }

    onResize() {
        if(this.avatar) {
            this.avatar.resize();
        }
    }

    updateStatus(text) {
        if(this.statusText) this.statusText.innerText = text;
    }

    async toggleRecording() {
        if (this.recorder && this.recorder.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        if(!this.recorder) {
            this.recorder = new AudioRecorder(
                (chunk) => {
                    this.ws.sendAudioChunk(chunk);
                },
                () => {
                    this.micBtn.classList.remove('listening');
                    this.waveform.stop();
                    this.updateStatus("Processing...");
                    if(this.avatar) this.avatar.playAnimation('thinking');
                }
            );
        }
        
        try {
            // Send language setting to backend
            this.ws.sendData({
                type: 'config',
                target_lang: this.langSelect.value
            });
            
            await this.recorder.start();
            this.micBtn.classList.add('listening');
            this.waveform.start();
            this.updateStatus("Listening...");
            this.userText.innerText = "...";
            this.translationText.innerText = "Listening...";
            
            if(this.audioPlayer) this.audioPlayer.pause();
            if(this.avatar) this.avatar.playAnimation('listening');
            
        } catch (err) {
            console.error("Start recording failed", err);
            this.updateStatus("Mic access denied");
        }
    }

    stopRecording() {
        if(this.recorder) {
            this.recorder.stop();
            // Send stop signal
            this.ws.sendData({ type: 'stop_recording' });
        }
    }
}
