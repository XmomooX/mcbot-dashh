import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export function Dashboard() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [botInfo, setBotInfo] = useState(null);
    const chatbordRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:4000/dashboard")
            .then((res) => res.json())
            .then((data) => {
                if (data.info) {
                    setBotInfo(JSON.parse(data.info));
                }
            })
            .catch((err) => console.error("Error fetching bot info:", err));

        const socket = io("http://localhost:4000", { transports: ['websocket'], upgrade: false });
        socketRef.current = socket;

        socket.on("message", (data) => {
            console.log("Received:", data);
            setMessages((prev) => [...prev, `${data.author}: ${data.content}`]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;

        console.log("Emitting message:", input);
        socketRef.current.emit("send", input);

        setMessages((prev) => [...prev, `You: ${input}`]);
        setInput("");
        chatbordRef.current.scrollTop = chatbordRef.current.scrollHeight;
    };

    return (
        <>
            <link rel="stylesheet" href="css/dashboard.css" />
            <h1>Dashboard</h1>

            {botInfo ? (
                <>
                    <h2>Bot Information</h2>
                    <pre>{JSON.stringify(botInfo, null, 2)}</pre>
                </>
            ) : (
                <p>Bot is not available right now.</p>
            )}

            <div className="chat" id="chat">
                <div className="chatbord" id="chatbord" ref={chatbordRef}>
                    {messages.map((msg, index) => (
                        <p key={index} className="msg">{msg}</p>
                    ))}
                </div>

                <div className="input">
                    <input
                        type="text"
                        placeholder="enter your message"
                        className="msginput"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>

            <form action="/stopbot" method="POST">
                <button type="submit">Stop Bot</button>
            </form>
        </>
    );
}
