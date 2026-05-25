// chatbot.js
export class ChatbotManager {
    constructor() {
        this.chatPanel = document.getElementById('floatingChatPanel');
        this.floatingBtn = document.getElementById('floatingChatBtn');
        this.closeBtn = document.getElementById('chatCloseBtn');
        
        this.tabChat = document.getElementById('tabChat');
        this.tabZiva = document.getElementById('tabZiva');
        this.viewChat = document.getElementById('viewChat');
        this.viewZiva = document.getElementById('viewZiva');

        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSendBtn');
        this.area = document.getElementById('chatArea');

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.floatingBtn) this.floatingBtn.addEventListener('click', () => this.togglePanel());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.togglePanel());

        this.tabChat.addEventListener('click', () => this.switchTab('chat'));
        this.tabZiva.addEventListener('click', () => this.switchTab('ziva'));

        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    togglePanel() {
        this.chatPanel.classList.toggle('active');
        if (this.chatPanel.classList.contains('active')) {
            // Trigger 3D resize if Ziva is active
            if(window.zivaManager) window.zivaManager.onResize();
        }
    }

    switchTab(tab) {
        if (tab === 'chat') {
            this.tabChat.classList.add('active');
            this.tabZiva.classList.remove('active');
            this.viewChat.classList.add('active');
            this.viewZiva.classList.remove('active');
        } else {
            this.tabZiva.classList.add('active');
            this.tabChat.classList.remove('active');
            this.viewZiva.classList.add('active');
            this.viewChat.classList.remove('active');
            
            // Re-render avatar if needed
            if(window.zivaManager) window.zivaManager.onResize();
        }
    }

    appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = `msg ${role}`;
        const avatarSrc = role === 'ai'
            ? 'https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff'
            : 'https://ui-avatars.com/api/?name=U&background=DF6951&color=fff';
        
        div.innerHTML = `
            <img src="${avatarSrc}" class="msg-avatar" alt="${role}">
            <div class="msg-bubble">${text}</div>
        `;
        this.area.appendChild(div);
        this.area.scrollTop = this.area.scrollHeight;
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        this.input.value = '';

        // Mock AI response for Chat Mode
        setTimeout(() => {
            this.appendMessage('ai', 'This is a response from the text assistant.');
        }, 1000);
    }
}
