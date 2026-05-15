/* YatraSaathi — dashboard.js */

document.addEventListener('DOMContentLoaded', () => {
  // Chat Assistant Functionality
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatArea = document.getElementById('chatArea');

  if (chatInput && chatSend && chatArea) {
    const responses = [
      "I've updated your route for tomorrow to avoid the morning traffic. You'll have an extra 30 minutes at the museum.",
      "The local exchange rate just improved slightly. It's a good time to withdraw some cash.",
      "Based on your preference for hidden gems, I've found a fantastic local ramen shop just 2 blocks from your Day 3 path.",
      "I can certainly translate that for you. Opening the translation module now."
    ];

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.innerHTML = `<div class="msg-bubble">${text}</div>`;
      chatArea.appendChild(userMsg);

      chatInput.value = '';
      chatArea.scrollTop = chatArea.scrollHeight;

      // Simulate AI typing indicator
      const aiTyping = document.createElement('div');
      aiTyping.className = 'chat-msg ai';
      aiTyping.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff" alt="AI">
        <div class="msg-bubble">
          <span style="display:inline-block;width:6px;height:6px;background:var(--clr-purple);border-radius:50%;animation:pulse 1s infinite"></span>
          <span style="display:inline-block;width:6px;height:6px;background:var(--clr-purple);border-radius:50%;animation:pulse 1s 0.2s infinite"></span>
          <span style="display:inline-block;width:6px;height:6px;background:var(--clr-purple);border-radius:50%;animation:pulse 1s 0.4s infinite"></span>
        </div>
      `;
      chatArea.appendChild(aiTyping);
      chatArea.scrollTop = chatArea.scrollHeight;

      // Simulate AI response
      setTimeout(() => {
        aiTyping.remove();
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg ai';
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        aiMsg.innerHTML = `
          <img src="https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff" alt="AI">
          <div class="msg-bubble">${randomResponse}</div>
        `;
        chatArea.appendChild(aiMsg);
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 1500);
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
});
