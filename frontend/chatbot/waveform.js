// waveform.js
export class WaveformVisualizer {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.isActive = false;
    }

    start() {
        if(!this.element) return;
        this.isActive = true;
        this.element.classList.add('active');
        // Simple CSS-based wave via .active class
    }

    stop() {
        if(!this.element) return;
        this.isActive = false;
        this.element.classList.remove('active');
    }
}
