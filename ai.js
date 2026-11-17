// ======================================
// FLASH AI 2.0 - CHAT INTERFACE
// ======================================

const chatForm = document.getElementById("chatForm");
const userMessage = document.getElementById("userMessage");
const chatMessages = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");

let conversationHistory = [];
let isResponding = false;

// DISPLAY A MESSAGE IN THE CHAT
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "ai" ? "🤖" : "👤";

    const content = document.createElement("div");
    content.className = "message-content";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    content.appendChild(paragraph);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

// SHOW A TYPING INDICATOR
function showTypingIndicator() {
    return addMessage("FLASH AI is thinking...", "ai");
}

// SEND MESSAGE TO AI BACKEND
async function sendMessage(question) {
    if (isResponding || !question.trim()) {
        return;
    }

    isResponding = true;
    sendBtn.disabled = true;

    addMessage(question, "user");
    userMessage.value = "";

    const typingIndicator = showTypingIndicator();

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: question,
                history: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error("AI service unavailable");
        }

        const data = await response.json();

        if (typeof data.reply !== "string") {
            throw new Error("Invalid AI response");
        }

        typingIndicator.remove();

        addMessage(data.reply, "ai");

        // REMEMBER THE CONVERSATION
        conversationHistory.push(
            { role: "user", content: question },
            { role: "assistant", content: data.reply }
        );

        // KEEP RECENT MESSAGES
        conversationHistory = conversationHistory.slice(-20);

    } catch (error) {
        typingIndicator.remove();

        addMessage(
            "⚠️ FLASH AI is not connected yet. Please try again once the AI server is running.",
            "ai"
        );

        console.error(error);

    } finally {
        isResponding = false;
        sendBtn.disabled = false;
        userMessage.focus();
    }
}

// HANDLE CHAT FORM
chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const question = userMessage.value.trim();
    sendMessage(question);
});

// QUICK QUESTION BUTTONS
document.querySelectorAll(".quick-btn").forEach(button => {
    button.addEventListener("click", function() {
        const question = this.dataset.question;
        sendMessage(question);
    });
});