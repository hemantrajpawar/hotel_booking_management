import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("token");

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(
        "/api/chatbot/chat",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Something went wrong." },
      ]);
    }
  };

  return (
    <div className="chatbox">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === "user" ? "user-msg" : "bot-msg"}
          >
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    style={{ color: "yellow", textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="input-msg">
        {" "}
        <input
          type="text"
          value={input}
          style={{ background: "black", color: "white" }}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything..."
        />
        <button
          onClick={sendMessage}
          type="button"
          style={{
            background: "#323232",
            borderRadius: "50px",
            border: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#fff"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
