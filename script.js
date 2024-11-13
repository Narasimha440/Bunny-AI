const userInput = document.getElementById("userInput");
const messagesContainer = document.getElementById("messages");
const spinner = document.getElementById("spinner");

let conversationHistory = [];

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    createMessageElement(userMessage, "user");
    userInput.value = "";

    conversationHistory.push({ role: "user", content: userMessage });

    spinner.style.display = "block";

    const requestBody = {
        inputs: userMessage,
    };

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b", {
            method: "POST",
            headers: {
                Authorization: `Bearer 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`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const responseData = await response.json();

            let botMessage = "Hi there! I'm Bunny 😊 How can I assist you today?";

            if (responseData && responseData.length > 0) {
                const generatedText = responseData[0].generated_text;
                if (generatedText) {
                    botMessage = generatedText;
                }
            }

            conversationHistory.push({ role: "bot", content: botMessage });
            createMessageElement(botMessage, "bot");
        } else {
            if (response.status === 422) {
                createMessageElement("There was an issue with the request format. Please try again. 😓", "bot");
            } else {
                createMessageElement("Oops! Something went wrong. Please try again. 😓", "bot");
            }
        }
    } catch (error) {
        createMessageElement("Unable to connect to Bunny AI. Please check your connection. 🌐🔌", "bot");
    } finally {
        spinner.style.display = "none";
    }
}

function createMessageElement(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${type}-message`);

    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = type === "user" ? "user-avatar.png" : "bunny.png";

    const messageText = document.createElement("p");
    messageText.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageText);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
