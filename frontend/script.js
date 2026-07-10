// ========================================================
// HCL AI Support Chatbot
// Production Ready
// ========================================================

const API_URL = "http://127.0.0.1:8000/chat";

// =======================
// Elements
// =======================

const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");

const fetchUserBtn = document.getElementById("fetchUserBtn");

const kbSelect = document.getElementById("kbSelect");

const messageInput = document.getElementById("messageInput");

const sendBtn = document.getElementById("sendBtn");

const chatMessages = document.getElementById("chatMessages");

const typingIndicator = document.getElementById("typingIndicator");

const userStatus = document.getElementById("userStatus");

// =======================
// Variables
// =======================

let username = "";
let email = "";
let isUserValidated = false;

// =======================
// Open Chat
// =======================

chatToggle.addEventListener("click", () => {

    chatWindow.style.display = "flex";

});

// =======================
// Close Chat
// =======================

closeChat.addEventListener("click", () => {

    chatWindow.style.display = "none";

});

// =======================
// Fetch User
// =======================

fetchUserBtn.addEventListener("click", validateUser);

// =======================
// Send Message
// =======================

sendBtn.addEventListener("click", sendMessage);

// =======================
// Enter Key
// =======================

messageInput.addEventListener("keydown",function(e){

    if (e.key === "Enter") {

        sendMessage();

    }

});

// =======================
// Validate User
// =======================

function validateUser() {

    username = usernameInput.value.trim();

    email = emailInput.value.trim();

    if (username === "") {

        alert("Please enter Username");

        usernameInput.focus();

        return;

    }

    if (email === "") {

        alert("Please enter Email");

        emailInput.focus();

        return;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        alert("Please enter valid Email.");

        emailInput.focus();

        return;

    }

    isUserValidated = true;

    userStatus.innerHTML =
        `✅ Welcome <b>${username}</b>`;

    messageInput.disabled = false;

    sendBtn.disabled = false;

    kbSelect.disabled = false;

    usernameInput.disabled = true;

    emailInput.disabled = true;

    fetchUserBtn.disabled = true;

    messageInput.focus();
    
}

// ========================================================
// Send Message
// ========================================================

async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    // Remove welcome card (first message only)
    const welcomeCard = document.querySelector(".welcome-card");
    if (welcomeCard) {
        welcomeCard.remove();
    }

    // Show user message
    addUserMessage(message);

    // Clear textbox
    messageInput.value = "";

    // Disable input while waiting
    messageInput.disabled = true;

    sendBtn.disabled = true;

    sendBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i>';

    // Show typing animation
    typingIndicator.style.display = "flex";

    scrollToBottom();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        if (!response.ok) {

            throw new Error("Unable to connect");

        }

        const data = await response.json();

        typingIndicator.style.display = "none";

        addBotMessage(data.reply);

    }
    catch (error) {

        typingIndicator.style.display = "none";

        addBotMessage("❌ Unable to connect to AI Assistant.");

        console.error(error);

    }
    finally {

        messageInput.disabled = false;
        sendBtn.disabled = false;

        sendBtn.innerHTML =
        '<i class="fa-solid fa-paper-plane"></i>';

        messageInput.focus();

        scrollToBottom();

    }

}

// ========================================================
// User Message
// ========================================================

function addUserMessage(message) {

    const time = getCurrentTime();

    const html = `

        <div class="message user">

            <div class="bubble">

                <div class="sender">

                    ${username}

                </div>

                <div class="msg-text">

                    ${escapeHtml(message)}

                </div>

                <div class="msg-time">

                    ${time}

                </div>

            </div>

            <div class="avatar user-avatar">

                ${username.charAt(0).toUpperCase()}

            </div>

        </div>

    `;

    chatMessages.insertAdjacentHTML("beforeend", html);

}

// ========================================================
// Bot Message with Typing Animation
// ========================================================

function addBotMessage(message) {

    const time = getCurrentTime();

    const wrapper = document.createElement("div");

    wrapper.className = "message bot";

    wrapper.innerHTML = `

        <div class="avatar bot-avatar">

            🤖

        </div>

        <div class="bubble">

            <div class="sender">

                AI Assistant

            </div>

            <div class="msg-text"></div>

            <div class="msg-time">

                ${time}

            </div>

            <div class="message-actions">

                <button class="copy-btn">

                    📋 Copy

                </button>

                <button class="like-btn">

                    👍

                </button>

                <button class="dislike-btn">

                    👎

                </button>

            </div>

        </div>

    `;

    chatMessages.appendChild(wrapper);

    const textContainer = wrapper.querySelector(".msg-text");

    typeMessage(textContainer, message);

    // Copy Button

    wrapper.querySelector(".copy-btn").onclick = function () {

        navigator.clipboard.writeText(message);

        this.innerHTML = "✔ Copied";

        setTimeout(() => {

            this.innerHTML = "📋 Copy";

        },1500);

    };

    scrollToBottom();

}

// ========================================================
// Typing Effect
// ========================================================

function typeMessage(element, text){

    let index = 0;

    element.innerHTML = "";

    const timer = setInterval(function(){

        if(index >= text.length){

            clearInterval(timer);

            messageInput.disabled = false;

            sendBtn.disabled = false;

            messageInput.focus();

            return;

        }

        element.innerHTML += text.charAt(index);

        scrollToBottom();

        index++;

    },15);

}

// ========================================================
// Current Time
// ========================================================

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

// ========================================================
// Escape HTML
// ========================================================

function escapeHtml(text) {

    const div = document.createElement("div");

    div.innerText = text;

    return div.innerHTML;

}

// ========================================================
// Format Message
// ========================================================

function formatMessage(text) {

    return escapeHtml(text)

        .replace(/\n/g, "<br>");

}

// ========================================================
// Scroll
// ========================================================

// function scrollToBottom() {

//     chatMessages.scrollTop = chatMessages.scrollHeight;

// }

function scrollToBottom(){

    chatMessages.scrollTo({

        top:chatMessages.scrollHeight,

        behavior:"smooth"

    });

}

// ========================================================
// New Chat
// ========================================================

function clearConversation(){

    chatMessages.innerHTML = `

    <div class="welcome-card">

        <div class="welcome-icon">

            🤖

        </div>

        <h3>

            Welcome to HCL AI Support

        </h3>

        <p>

            Ask anything about your application.

        </p>

    </div>

    `;

}