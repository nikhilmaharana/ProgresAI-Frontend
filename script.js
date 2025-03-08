let userName = "";
const assistantName = "ProgresAI";

// Show the welcome modal when the page loads
window.onload = function() {
    document.getElementById("welcome-modal").style.display = "flex";
};

// Handle the user clicking the "Start Chat" button
document.getElementById("start-chat").addEventListener("click", function() {
    userName = document.getElementById("username").value.trim();
    if (userName === "") {
        alert("Please enter your name.");
        return;
    }
    document.getElementById("welcome-modal").style.display = "none";
    document.querySelector(".chat-container").style.display = "block";
    addMessage("bot", `Hi ${userName}, I'm ${assistantName}. How can I assist you today?`);
});

// Add message to chat window
function addMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");

    // Replace \n with <br> for proper formatting
    messageElement.innerHTML = message.replace(/\n/g, "<br>");

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// Handle key press (Enter key)
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    addMessage("user", userInput);
    document.getElementById("user-input").value = "";

    fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput, user_name: userName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.assistant_message) {
            addMessage("bot", data.assistant_message);
        } else {
            addMessage("bot", "Sorry, something went wrong.");
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        addMessage("bot", "There was an error connecting to the server.");
    });
}
