import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./css/Dashboard.css"
export function Dashboard() {
    const [messages, setMessages] = useState([]);
    const [health, setHealth] = useState(undefined)
    const [food, setFood] = useState(undefined)
    const [input, setInput] = useState("");
    const [botInfo, setBotInfo] = useState(null);
    const chatbordRef = useRef(null);
    const socketRef = useRef(null);
    const serverURL = "https://mcbot-dashh.onrender.com"
    useEffect(() => {
        fetch(`${serverURL}/dashboard`)
            .then((res) => res.json())
            .then((data) => {
                if (data.info) {
                    setBotInfo(JSON.parse(data.info));
                }
            })
            .catch((err) => console.error("Error fetching bot info:", err));

        const socket = io(serverURL, { transports: ['websocket'], upgrade: false });
        socketRef.current = socket;

        socket.on("message", (data) => {
            console.log("Received:", data);
            setMessages((prev) => [...prev, `${data.author}: ${data.content}`]);
        });

        socket.on("health", data => {
            setHealth(data)
        })
        socket.on("food", data => {
            setFood(data)
        })
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
            <div className="dashboard-container">
                <div className="dashboard-main">
                    <h1 className="dashboard-title">Dashboard</h1>

                    {botInfo ? (
                        <>
                            <div className="bot-info-container">
                                <h2 className="dashboard-subtitle">Bot Information</h2>
                                <div className="bot-info-wrapper">
                                    <pre className="bot-info">Username: {botInfo.username}</pre>
                                    <pre className="bot-info">Health: {health ? health : botInfo.health}</pre>
                                    <pre className="bot-info">Food: {food ? food : botInfo.food}</pre>
                                    <pre className="bot-info">inv: {botInfo.inventory}</pre>
                                </div>
                            </div>
                            <form className="stopbot-form" action={`${serverURL}/stopbot`} method="POST">
                                <button type="submit" className="stopbot-button">Stop</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <form className="startbot-form" action={`${serverURL}/startbot`} method="POST">
                                <button type="submit" className="startbot-button" onClick={() => {
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 5000);
                                }}>Start</button>
                            </form>
                        </>
                    )}

                    <div className="chat-container">
                        <div className="chat-messages" ref={chatbordRef}>
                            {messages.map((msg, index) => (
                                <p key={index} className="chat-message">{msg}</p>
                            ))}
                        </div>
{/* test commit */}
                        <div className="chat-input-container">
                            <input
                                type="text"
                                placeholder="enter your message"
                                className="chat-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button className="send-button" onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
